# test_environment.py
import torch
import torchvision
from ultralytics import YOLO
import flask

print(f"PyTorch: {torch.__version__}")
print(f"Torchvision: {torchvision.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print("YOLO model:", YOLO('yolov8n.pt'))  # Will download small test model
print(f"Flask: {flask.__version__}")