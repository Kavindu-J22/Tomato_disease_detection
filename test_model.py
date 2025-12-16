"""
Test script to evaluate the TensorFlow.js model (if converted back to .h5)
or to train and evaluate a new model using the existing dataset.

This script will:
1. Load the dataset
2. Either load existing model or train a new one
3. Evaluate on test set
4. Generate accuracy metrics and confusion matrix
"""

import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Configuration
DATASET_DIR = 'Dataset'
MODEL_PATH = 'Greenify/tomato_model.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# Class names (matching the folder structure)
CLASS_NAMES = ['Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight', 
               'Tomato_Leaf_Mold', 'Tomato_healthy']

def load_dataset():
    """Load and prepare the dataset"""
    print("📂 Loading dataset...")
    
    # Create data generator for testing (no augmentation)
    test_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Load validation set
    test_generator = test_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    return test_generator

def evaluate_model(model_path, test_generator):
    """Evaluate the model and generate metrics"""
    print(f"\n🔍 Loading model from {model_path}...")
    
    try:
        model = load_model(model_path)
        print("✅ Model loaded successfully!")
        
        # Model summary
        print("\n📊 Model Summary:")
        model.summary()
        
        # Evaluate on test set
        print("\n🧪 Evaluating model on test set...")
        test_loss, test_accuracy = model.evaluate(test_generator)
        
        print(f"\n📈 Test Results:")
        print(f"   Loss: {test_loss:.4f}")
        print(f"   Accuracy: {test_accuracy*100:.2f}%")
        
        # Generate predictions
        print("\n🔮 Generating predictions...")
        predictions = model.predict(test_generator)
        predicted_classes = np.argmax(predictions, axis=1)
        true_classes = test_generator.classes
        
        # Classification report
        print("\n📋 Classification Report:")
        print(classification_report(true_classes, predicted_classes, 
                                   target_names=CLASS_NAMES))
        
        # Confusion matrix
        print("\n🎯 Generating confusion matrix...")
        cm = confusion_matrix(true_classes, predicted_classes)
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=[c.replace('Tomato_', '') for c in CLASS_NAMES],
                   yticklabels=[c.replace('Tomato_', '') for c in CLASS_NAMES])
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
        print("✅ Confusion matrix saved as 'confusion_matrix.png'")
        
        # Per-class accuracy
        print("\n📊 Per-Class Accuracy:")
        for i, class_name in enumerate(CLASS_NAMES):
            class_correct = cm[i, i]
            class_total = cm[i].sum()
            class_acc = (class_correct / class_total * 100) if class_total > 0 else 0
            print(f"   {class_name.replace('Tomato_', '')}: {class_acc:.2f}% ({class_correct}/{class_total})")
        
        return {
            'test_loss': test_loss,
            'test_accuracy': test_accuracy,
            'predictions': predictions,
            'confusion_matrix': cm
        }
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("\n💡 The model file doesn't exist. You need to train the model first.")
        print("   Run: python mobilenet.py")
        return None

def print_dataset_info():
    """Print dataset statistics"""
    print("\n📊 Dataset Information:")
    print("=" * 60)
    
    total_images = 0
    for class_name in CLASS_NAMES:
        class_path = os.path.join(DATASET_DIR, class_name)
        if os.path.exists(class_path):
            count = len([f for f in os.listdir(class_path) 
                        if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            total_images += count
            print(f"   {class_name.replace('Tomato_', ''):20s}: {count:5d} images")
    
    print("=" * 60)
    print(f"   {'TOTAL':20s}: {total_images:5d} images")
    print(f"\n   Training set (80%): ~{int(total_images * 0.8)} images")
    print(f"   Validation set (20%): ~{int(total_images * 0.2)} images")

if __name__ == "__main__":
    print("🌱 Greenify - Model Evaluation Script")
    print("=" * 60)
    
    # Print dataset info
    print_dataset_info()
    
    # Check if model exists
    if os.path.exists(MODEL_PATH):
        print(f"\n✅ Model file found: {MODEL_PATH}")
        
        # Load dataset
        test_generator = load_dataset()
        
        # Evaluate model
        results = evaluate_model(MODEL_PATH, test_generator)
        
        if results:
            print("\n" + "=" * 60)
            print("✅ Evaluation Complete!")
            print("=" * 60)
    else:
        print(f"\n❌ Model file not found: {MODEL_PATH}")
        print("\n💡 To train the model, run:")
        print("   python mobilenet.py")
        print("\n   This will:")
        print("   1. Train a MobileNetV2 model on your dataset")
        print("   2. Save the model as 'tomato_model.h5'")
        print("   3. Convert it to TensorFlow.js format")
        print("   4. Display training accuracy and loss curves")

