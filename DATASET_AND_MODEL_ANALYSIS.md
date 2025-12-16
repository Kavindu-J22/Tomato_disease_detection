# 📊 Dataset & Model Analysis Report

**Project:** Greenify - Tomato Leaf Disease Detection  
**Date:** December 15, 2025  
**Analysis Type:** Dataset Statistics & Model Architecture

---

## 📁 Dataset Overview

### **Dataset Location:** `Dataset/`

### **Dataset Statistics:**

| Class | Folder Name | Image Count | Percentage |
|-------|-------------|-------------|------------|
| 0 | Tomato_Bacterial_spot | 2,127 | 28.1% |
| 1 | Tomato_Early_blight | 1,000 | 13.2% |
| 2 | Tomato_Late_blight | 1,925 | 25.4% |
| 3 | Tomato_Leaf_Mold | 962 | 12.7% |
| 4 | Tomato_healthy | 1,591 | 21.0% |
| **TOTAL** | **5 classes** | **7,605** | **100%** |

### **Dataset Split (Recommended):**
- **Training Set (80%):** ~6,084 images
- **Validation Set (20%):** ~1,521 images

### **Dataset Balance:**
- ✅ **Reasonably balanced** - No class has less than 10% or more than 30%
- Largest class: Bacterial Spot (2,127 images)
- Smallest class: Leaf Mold (962 images)
- Ratio: 2.2:1 (acceptable for deep learning)

### **Image Format:**
- **File Type:** JPG/JPEG
- **Naming Convention:** UUID-based with class labels
- **Source:** Appears to be from GCREC (Gulf Coast Research and Education Center) and UF.GRC

---

## 🧠 Model Architecture Analysis

### **Model Type:** Transfer Learning with MobileNetV2

### **Architecture Details:**

```
┌─────────────────────────────────────┐
│  Input Layer: [null, 224, 224, 3]  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   MobileNetV2 Base (Pre-trained)    │
│   - 157 total layers                │
│   - Trained on ImageNet             │
│   - Depthwise Separable Convolutions│
│   - Inverted Residual Blocks        │
│   - ReLU6 activations               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   GlobalAveragePooling2D            │
│   Output: [null, 1280]              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Dense Layer (128 units)           │
│   Activation: ReLU                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Dropout (0.5)                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Output Dense (5 units)            │
│   Activation: Softmax               │
│   Classes: [0-4]                    │
└─────────────────────────────────────┘
```

### **Model Specifications:**

- **Framework:** Keras 3.10.0 with TensorFlow backend
- **Converter:** TensorFlow.js Converter v4.22.0
- **Format:** TensorFlow.js Layers Model
- **Input Shape:** [batch_size, 224, 224, 3]
- **Output Shape:** [batch_size, 5]
- **Total Parameters:** ~2.3M (estimated)
- **Trainable Parameters:** ~200K (top layers only)
- **Frozen Parameters:** ~2.1M (MobileNetV2 base)

### **Key Features:**

1. **Depthwise Separable Convolutions:**
   - Reduces computational cost
   - Maintains accuracy
   - Ideal for mobile deployment

2. **Inverted Residual Blocks:**
   - Efficient feature extraction
   - Skip connections for gradient flow
   - Prevents vanishing gradients

3. **Batch Normalization:**
   - Stabilizes training
   - Faster convergence
   - Better generalization

4. **ReLU6 Activation:**
   - Bounded activation (0-6)
   - Better for mobile/embedded devices
   - Prevents numerical overflow

---

## 🎯 Training Configuration

### **From mobilenet.py:**

```python
# Phase 1: Train top layers (base frozen)
Epochs: 10
Optimizer: Adam
Learning Rate: 0.001
Loss: Categorical Crossentropy
Metrics: Accuracy

# Phase 2: Fine-tuning (last 50 layers unfrozen)
Epochs: 5
Optimizer: Adam
Learning Rate: 0.0001 (reduced)
Loss: Categorical Crossentropy
Metrics: Accuracy
```

### **Data Augmentation:**

```python
ImageDataGenerator(
    rotation_range=20,        # ±20 degrees
    width_shift_range=0.2,    # ±20% horizontal
    height_shift_range=0.2,   # ±20% vertical
    shear_range=0.2,          # Shear transformation
    zoom_range=0.2,           # ±20% zoom
    horizontal_flip=True,     # Random flip
    brightness_range=[0.8, 1.2],  # ±20% brightness
    fill_mode='nearest'       # Fill strategy
)
```

### **Why This Matters:**
- **Prevents overfitting** on limited dataset
- **Improves generalization** to real-world images
- **Simulates variations** in lighting, angle, distance
- **Increases effective dataset size** by 10-20x

---

## 📈 Expected Performance

### **Based on Similar Models:**

| Metric | Expected Range | Notes |
|--------|---------------|-------|
| Training Accuracy | 85-95% | After 15 epochs |
| Validation Accuracy | 80-90% | With augmentation |
| Test Accuracy | 75-85% | Real-world images |
| Inference Time (Mobile) | 50-200ms | Per image |
| Model Size | ~9MB | TensorFlow.js format |

### **Per-Class Performance (Estimated):**

Based on dataset size and balance:

- **Bacterial Spot (2,127 images):** 85-90% accuracy
- **Early Blight (1,000 images):** 75-85% accuracy
- **Late Blight (1,925 images):** 85-90% accuracy
- **Leaf Mold (962 images):** 75-85% accuracy
- **Healthy (1,591 images):** 90-95% accuracy

**Note:** Healthy leaves are typically easier to classify.

---

## 🔬 Model Validation Strategy

### **To Obtain Actual Accuracy:**

1. **Run Training Script:**
   ```bash
   python mobilenet.py
   ```

2. **Expected Output:**
   - Training/validation accuracy curves
   - Loss curves
   - Final model saved as `tomato_model.h5`
   - TensorFlow.js conversion

3. **Run Evaluation Script:**
   ```bash
   python test_model.py
   ```

4. **Expected Metrics:**
   - Overall accuracy
   - Per-class accuracy
   - Confusion matrix
   - Classification report (precision, recall, F1-score)

---

## 🚀 Deployment Considerations

### **Mobile App (Current Setup):**

**Advantages:**
- ✅ On-device inference (no internet required)
- ✅ Fast predictions (50-200ms)
- ✅ Privacy-preserving (data stays on device)
- ✅ Works offline

**Challenges:**
- ⚠️ Model size (~9MB download)
- ⚠️ Device compatibility (older phones may be slow)
- ⚠️ Battery consumption

### **Server-Side (Flask Backend):**

**Advantages:**
- ✅ Faster inference on GPU
- ✅ Easier to update model
- ✅ Can use larger, more accurate models
- ✅ Centralized logging and analytics

**Challenges:**
- ⚠️ Requires internet connection
- ⚠️ Server costs
- ⚠️ Latency (network delay)
- ⚠️ Privacy concerns (images sent to server)

---

## 💡 Recommendations

### **Immediate Actions:**

1. ✅ **Test the mobile app** with sample images from Dataset/
2. ✅ **Train the model** to get actual accuracy metrics
3. ✅ **Evaluate on test set** using test_model.py
4. ✅ **Document results** for future reference

### **Model Improvements:**

1. **Collect more data** for underrepresented classes (Early Blight, Leaf Mold)
2. **Add more augmentation** (color jitter, random erasing)
3. **Try different architectures** (EfficientNet, ResNet)
4. **Ensemble models** for better accuracy
5. **Use TensorFlow Lite** for faster mobile inference

### **App Improvements:**

1. **Add confidence threshold** (e.g., only show results if >70% confident)
2. **Show top-3 predictions** instead of just top-1
3. **Add image quality check** (blur detection, lighting check)
4. **Collect user feedback** to improve model
5. **A/B testing** different model versions

---

## 📊 Summary

**Dataset:** ✅ Good quality, reasonably balanced, sufficient size (7,605 images)  
**Model:** ✅ Appropriate architecture (MobileNetV2), ready for deployment  
**Training:** ⚠️ Needs to be run to obtain accuracy metrics  
**Deployment:** ✅ Mobile app ready, Flask backend optional

**Next Step:** Train the model and evaluate performance!

---

**Generated:** December 15, 2025  
**By:** Augment Agent  
**Project:** Greenify - Tomato Leaf Disease Detection

