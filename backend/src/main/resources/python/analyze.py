import sys
import json
import traceback
import torch
import torchvision.transforms as T
from torchvision.models import resnet50
from torchvision.models.segmentation import deeplabv3_resnet50
from PIL import Image, ImageDraw
import numpy as np
from ultralytics import YOLO
from io import BytesIO
import base64
import requests
import gc
from ultralytics.utils import LOGGER

# muting YOLO logs
LOGGER.setLevel("ERROR")

def load_models():
    try:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        cls_model = resnet50(weights="IMAGENET1K_V1").to(device).eval()
        det_model = YOLO("yolov5su.pt").to(device)
        seg_model = deeplabv3_resnet50(weights="DEFAULT").to(device).eval()

        try:
            imagenet_labels = requests.get(
                "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt",
                timeout=10
            ).text.splitlines()
        except requests.exceptions.RequestException:
            imagenet_labels = []

        segmentation_labels = [
            'background', 'aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus',
            'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike',
            'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor'
        ]

        return {
            "success": True,
            "cls_model": cls_model,
            "det_model": det_model,
            "seg_model": seg_model,
            "imagenet_labels": imagenet_labels,
            "segmentation_labels": segmentation_labels,
            "device": device
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Model loading failed: {str(e)}",
            "traceback": traceback.format_exc()
        }

def image_to_base64(img):
    buf = BytesIO()
    try:
        img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception:
        return ""
    finally:
        buf.close()

def analyze_image(image_path, models):
    try:
        # 1. Validate and load image
        try:
            with Image.open(image_path) as img:
                img.verify()
            img = Image.open(image_path).convert("RGB")
        except Exception as e:
            return {
                "success": False,
                "error": f"Invalid image file: {str(e)}"
            }

        # 2. Smart resizing for large images
        max_pixels = 10_000_000  # 10MP limit
        original_width, original_height = img.size
        
        if original_width * original_height > max_pixels:
            ratio = (max_pixels / (original_width * original_height)) ** 0.5
            new_width = int(original_width * ratio)
            new_height = int(original_height * ratio)
            img = img.resize((new_width, new_height), Image.LANCZOS)
            
        img_width, img_height = img.size

        max_seg_size = 512
        if max(img_width, img_height) > max_seg_size:
            scale = max_seg_size / max(img_width, img_height)
            seg_width = int(img_width * scale)
            seg_height = int(img_height * scale)
            seg_img = img.resize((seg_width, seg_height), Image.LANCZOS)
        else:
            seg_img = img
            seg_width, seg_height = img_width, img_height

        # 3. Classification
        transform = T.Compose([T.Resize((224, 224)), T.ToTensor()])
        input_cls = transform(img).unsqueeze(0).to(models["device"])
        with torch.no_grad():
            out_cls = models["cls_model"](input_cls)
        cls_id = out_cls.argmax().item()
        cls_name = models["imagenet_labels"][cls_id] if cls_id < len(models["imagenet_labels"]) else "unknown"

        # 4. Detection
        det_results = models["det_model"](img)[0]
        det_img = img.copy()
        draw = ImageDraw.Draw(det_img)
        detections = []
        pet_detected = False

        for box in det_results.boxes:
            x1, y1, x2, y2 = map(float, box.xyxy[0])
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = models["det_model"].model.names[cls_id]

            if label.lower() in ["cat", "dog"]:
                pet_detected = True
                detections.append({
                    "class": label,
                    "confidence": round(conf, 4),
                    "bbox": [round(x, 2) for x in [x1, y1, x2, y2]]
                })
                draw.rectangle([x1, y1, x2, y2], outline="lime", width=5)
                draw.text((x1, y1 - 15), f"{label} {conf:.2f}", fill="lime")

        # 5. Segmentation (only if pets detected)
        segmentation_img_str = ""
        detection_img_str = ""
        input_seg = None  

        if pet_detected:
            # generate detection image
            detection_img_str = image_to_base64(det_img)

            # generate segmentation
            seg_transform = T.Compose([
                T.ToTensor(),
                T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            input_seg = seg_transform(seg_img).unsqueeze(0).to(models["device"])
            with torch.no_grad():
                seg_output = models["seg_model"](input_seg)["out"]
            seg_mask = torch.argmax(seg_output.squeeze(0), dim=0).cpu().numpy()
            seg_mask = Image.fromarray(seg_mask.astype(np.uint8))
            seg_mask = seg_mask.resize((img_width, img_height), Image.NEAREST)
            seg_mask = np.array(seg_mask)

            # segmentation visualization
            seg_vis = Image.new("RGB", img.size, (128, 0, 128))
            yellow = (255, 255, 0)
            seg_mask_np = np.array(seg_mask)

            for class_id in [8, 12]:  # cats and dogs
                binary_mask = (seg_mask_np == class_id).astype(np.uint8) * 255
                yellow_layer = Image.new("RGB", img.size, yellow)
                seg_vis.paste(yellow_layer, (0, 0), Image.fromarray(binary_mask).convert("L"))

            segmentation_img_str = image_to_base64(seg_vis)

        to_delete = [input_cls, out_cls]
        if input_seg is not None:
            to_delete.extend([input_seg, seg_output, seg_mask])
            
        del to_delete
        torch.cuda.empty_cache() if models["device"] == "cuda" else None
        gc.collect()

        return {
            "success": True,
            "classification": cls_name,
            "detections": detections,
            "visualizations": {
                "detection": detection_img_str if pet_detected else None,
                "segmentation": segmentation_img_str if pet_detected else None
            },
            "metadata": {
                "device": models["device"],
                "torch_version": torch.__version__,
                "classification_model": "resnet50",
                "detection_model": "yolov5su",
                "segmentation_model": "deeplabv3",
                "image_width": original_width,
                "image_height": original_height,
                "pets_detected": pet_detected
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Image processing failed: {str(e)}",
            "traceback": traceback.format_exc()
        }

if __name__ == "__main__":
    try:
        models = load_models()
        if not models.get("success"):
            print(json.dumps(models))
            sys.exit(1)

        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "No image path provided"
            }))
            sys.exit(1)

        result = analyze_image(sys.argv[1], models)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"System error: {str(e)}",
            "traceback": traceback.format_exc()
        }))
        sys.exit(1)