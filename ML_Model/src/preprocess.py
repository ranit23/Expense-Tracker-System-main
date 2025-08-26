import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_path):
    """Load, resize, and preprocess the image."""
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (800, 1000))  # Resize for consistency
    img = cv2.GaussianBlur(img, (5, 5), 0)  # Reduce noise
    _, img = cv2.threshold(img, 150, 255, cv2.THRESH_BINARY)  # Binarization

    processed_path = image_path.replace(".jpg", "_processed.jpg")
    Image.fromarray(img).save(processed_path)
    return processed_path
