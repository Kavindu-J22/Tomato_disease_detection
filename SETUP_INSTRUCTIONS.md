# Greenify - Tomato Leaf Disease Detection App Setup Guide

## 📋 Overview
This project consists of:
1. **React Native Mobile App** (Greenify folder) - Uses TensorFlow.js for on-device predictions
2. **Flask Backend API** (Greenify/app.py) - Alternative server-side predictions using TensorFlow
3. **ML Training Scripts** (mobilenet.py, custom_cnn.py) - For training models

---

## 🚀 Quick Start

### **Option 1: Run Mobile App Only (Recommended)**
The mobile app has TensorFlow.js model files already in `Greenify/assets/model/` and can run predictions on-device.

#### Prerequisites:
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

#### Steps:

1. **Navigate to Greenify folder:**
```bash
cd Greenify
```

2. **Install missing dependencies:**
```bash
npm install @tensorflow/tfjs-react-native @react-native-async-storage/async-storage
```

3. **Install all dependencies:**
```bash
npm install
```

4. **Start Expo development server:**
```bash
npx expo start
```

5. **Run on device:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on physical device

---

### **Option 2: Run Flask Backend API**
For server-side predictions (requires trained .h5 model file).

#### Prerequisites:
- Python 3.9 or 3.10
- pip

#### Steps:

1. **Create Python virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. **Install Python dependencies:**
```bash
cd Greenify
pip install -r requirements.txt
```

4. **Train the model OR download pre-trained model:**
   
   **Option A - Train from scratch:**
   ```bash
   # Go back to root directory
   cd ..
   
   # Run training script (requires Google Colab or local GPU)
   python mobilenet.py
   ```
   This will create `tomato_model.h5` file.

   **Option B - Use existing TensorFlow.js model:**
   Convert the existing model.json to .h5 format (requires tensorflowjs package).

5. **Place `tomato_model.h5` in Greenify folder**

6. **Run Flask server:**
```bash
cd Greenify
python app.py
```

Server will start at `http://localhost:5000`

---

## 📊 Model Information

### **Current Model Status:**
✅ **TensorFlow.js model files exist** in `Greenify/assets/model/`:
- `model.json` - Model architecture (Keras 3.10.0, converted by TensorFlow.js 4.22.0)
- `group1-shard1of3.bin` - Weights (part 1)
- `group1-shard2of3.bin` - Weights (part 2)
- `group1-shard3of3.bin` - Weights (part 3)

✅ **Model is READY to use** in the React Native app
❌ **Missing:** `tomato_model.h5` for Flask backend (optional)

### **Model Architecture:**
- **Base Model:** MobileNetV2 (pre-trained on ImageNet)
- **Framework:** Keras 3.10.0 with TensorFlow backend
- **Input Shape:** [null, 224, 224, 3] (batch_size, height, width, channels)
- **Output:** 5 classes with softmax activation
- **Total Layers:** 157 layers (MobileNetV2 base + custom top layers)
- **Trainable:** Base layers frozen, only top layers trained

### **Disease Classes (Model Output Indices):**
According to the model.json and training scripts:
0. `bacterial_spot` - Bacterial Spot disease
1. `early_blight` - Early Blight disease
2. `late_blight` - Late Blight disease
3. `leaf_mold` - Leaf Mold disease
4. `healthy` - Healthy tomato leaf

**Note:** The modelHelper.js has been updated to match these indices.

### **Training Configuration (from mobilenet.py):**
- **Initial Training:** 10 epochs with frozen base model
- **Fine-tuning:** 5 epochs with last 50 layers unfrozen
- **Optimizer:** Adam
- **Loss:** Categorical Crossentropy
- **Data Augmentation:**
  - Rotation: ±20 degrees
  - Width/Height shift: ±20%
  - Shear: 20%
  - Zoom: ±20%
  - Horizontal flip
  - Brightness: 0.8-1.2
- **Validation Split:** 20%
- **Batch Size:** 32
- **Image Size:** 224x224 pixels

### **Model Performance:**
⚠️ **Accuracy metrics not available** - No training history files found in the project.

**To obtain accuracy:**
1. Train the model using `mobilenet.py` or `custom_cnn.py` with your dataset
2. The training script will output:
   - Training accuracy
   - Validation accuracy
   - Loss curves
   - Confusion matrix (custom_cnn.py)
   - Classification report (custom_cnn.py)

**Expected Performance (typical for MobileNetV2 on plant disease datasets):**
- Training Accuracy: 85-95%
- Validation Accuracy: 80-90%
- Inference Time: <100ms on mobile devices

---

## 🗂️ Dataset Structure

The dataset should be in `Dataset/` folder:
```
Dataset/
├── Tomato_Bacterial_spot/
├── Tomato_Early_blight/
├── Tomato_Late_blight/
├── Tomato_Leaf_Mold/
└── Tomato_healthy/
```

---

## 🔧 Troubleshooting

### **Issue: Model not loading in mobile app**
**Solution:**
1. Check that model files exist in `Greenify/assets/model/`
2. Ensure `@tensorflow/tfjs-react-native` is installed
3. Check console logs for specific errors

### **Issue: Flask backend can't find model**
**Solution:**
1. Train the model using `mobilenet.py` or `custom_cnn.py`
2. Ensure `tomato_model.h5` is in the `Greenify/` folder
3. Check Python version compatibility (3.9-3.10 recommended)

### **Issue: Camera permissions denied**
**Solution:**
1. Check `app.json` has camera permissions
2. On Android: Grant permissions in Settings
3. On iOS: Check Info.plist has camera usage description

---

## 📱 App Features

1. **Get Started Screen** - Welcome screen
2. **Home Screen** - Main menu with options
3. **Camera Screen** - Take photos of tomato leaves
4. **Gallery Picker** - Select existing photos
5. **Result Screen** - AI prediction with confidence score
6. **Remedies Screen** - Treatment and prevention info
7. **Settings** - Language selection (English/Sinhala/Tamil)
8. **Contact** - Agricultural support contact info

---

## 🌐 Multi-language Support

Supported languages:
- English (en)
- Sinhala (si)
- Tamil (ta) - partial

Translation files: `Greenify/src/translations/`

---

## 📞 Support

For agricultural advice:
- Email: info@doa.gov.lk
- Phone: 081-2388011
- Department of Agriculture, Sri Lanka

---

## 🎯 Next Steps

1. ✅ Install React Native dependencies
2. ✅ Fix modelHelper.js imports
3. ⏳ Test mobile app
4. ⏳ Train/obtain .h5 model for Flask backend
5. ⏳ Document actual model accuracy
6. ⏳ Test end-to-end functionality

---

## 📄 License

© 2025 Greenify. Powered by AI Technology.

