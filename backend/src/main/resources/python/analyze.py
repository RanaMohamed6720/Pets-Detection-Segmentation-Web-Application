import sys
import json
import traceback
import torch
import torchvision.transforms as T
from torchvision.models import resnet50
from torchvision.models.segmentation import lraspp_mobilenet_v3_large  
from PIL import Image, ImageDraw
import numpy as np
from ultralytics import YOLO
from io import BytesIO
import base64
import requests
import gc
from ultralytics.utils import LOGGER

# force cpu usage
torch.backends.cudnn.enabled = False
DEVICE = torch.device('cpu')

# muting YOLO logs
LOGGER.setLevel("ERROR")

def load_models():
    try:
        cls_model = resnet50(weights="IMAGENET1K_V1").to(DEVICE).eval()
        det_model = YOLO("yolov8n.pt").to(DEVICE)  # Smaller than yolov5n
        seg_model = lraspp_mobilenet_v3_large(weights="DEFAULT").to(DEVICE).eval()

        # quantize models to reduce size and improve CPU performance
        cls_model = torch.quantization.quantize_dynamic(
            cls_model, {torch.nn.Linear}, dtype=torch.qint8
        )
        seg_model = torch.quantization.quantize_dynamic(
            seg_model, {torch.nn.Linear}, dtype=torch.qint8
        )
        imagenet_labels = [f"class_{i}" for i in range(1000)]
        
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
            "device": DEVICE
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Model loading failed: {str(e)}",
            "traceback": traceback.format_exc()
        }

def image_to_base64(img):
    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def analyze_image(image_path, models):
    try:
        with Image.open(image_path) as img:
            img.verify()
        img = Image.open(image_path).convert("RGB")

        original_width, original_height = img.size
        max_pixels = 10_000_000
        if original_width * original_height > max_pixels:
            ratio = (max_pixels / (original_width * original_height)) ** 0.5
            img = img.resize((int(original_width * ratio), int(original_height * ratio)), Image.LANCZOS)

        img_width, img_height = img.size
        seg_img = img.resize((512, 512), Image.LANCZOS) if max(img_width, img_height) > 512 else img

        # Classification
        input_cls = T.Compose([T.Resize((224, 224)), T.ToTensor()])(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            out_cls = models["cls_model"](input_cls)
        cls_id = out_cls.argmax().item()
        cls_name = models["imagenet_labels"][cls_id] if cls_id < len(models["imagenet_labels"]) else "unknown"

        # Detection
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

        detection_img_str = image_to_base64(det_img) if pet_detected else None
        segmentation_img_str = None

        if pet_detected:
            input_seg = T.Compose([
                T.ToTensor(),
                T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])(seg_img).unsqueeze(0).to(DEVICE)
            with torch.no_grad():
                seg_output = models["seg_model"](input_seg)["out"]
            seg_mask = torch.argmax(seg_output.squeeze(0), dim=0).cpu().numpy()
            seg_mask = Image.fromarray(seg_mask.astype(np.uint8)).resize((img_width, img_height), Image.NEAREST)

            seg_vis = Image.new("RGB", img.size, (128, 0, 128))
            yellow = (255, 255, 0)
            for class_id in [8, 12]:  # cat, dog
                mask = (np.array(seg_mask) == class_id).astype(np.uint8) * 255
                yellow_layer = Image.new("RGB", img.size, yellow)
                seg_vis.paste(yellow_layer, (0, 0), Image.fromarray(mask).convert("L"))

            segmentation_img_str = image_to_base64(seg_vis)

        # memory cleanup
        del input_cls, out_cls
        if pet_detected:
            del input_seg, seg_output
        gc.collect()

        return {
            "success": True,
            "classification": cls_name,
            "detections": detections,
            "visualizations": {
                "detection": detection_img_str,
                "segmentation": segmentation_img_str
            },
            "metadata": {
                "device": "cpu",
                "torch_version": torch.__version__,
                "classification_model": "resnet50 (quantized)",
                "detection_model": "yolov8n",
                "segmentation_model": "lraspp_mobilenet_v3_large (quantized)",
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