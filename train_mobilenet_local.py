"""
Local Training Script for MobileNetV2 Tomato Disease Detection
Modified from mobilenet.py to run on local machine (not Google Colab)
"""

import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import matplotlib.pyplot as plt
import json

print("=" * 60)
print("🌱 Greenify - MobileNetV2 Training Script")
print("=" * 60)
print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {tf.keras.__version__}")

# Configuration
DATA_DIR = 'Dataset'  # Local dataset directory
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_PHASE1 = 10  # Initial training
EPOCHS_PHASE2 = 5   # Fine-tuning

# Check if dataset exists
if not os.path.exists(DATA_DIR):
    print(f"\n❌ ERROR: Dataset directory '{DATA_DIR}' not found!")
    print("Please make sure the Dataset folder is in the current directory.")
    exit(1)

print(f"\n✅ Dataset directory found: {DATA_DIR}")

# Count images
total_images = 0
for class_name in os.listdir(DATA_DIR):
    class_path = os.path.join(DATA_DIR, class_name)
    if os.path.isdir(class_path):
        count = len([f for f in os.listdir(class_path) 
                    if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
        total_images += count
        print(f"   {class_name}: {count} images")

print(f"\n📊 Total images: {total_images}")

# Setup Data Augmentation
print("\n📂 Setting up data generators...")
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=25,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest',
    validation_split=0.2
)

# Load Training Data (80%)
print("\n📥 Loading training data...")
train_generator = train_datagen.flow_from_directory(
    DATA_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

# Load Validation Data (20%)
print("\n📥 Loading validation data...")
validation_generator = train_datagen.flow_from_directory(
    DATA_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False
)

# Print class mapping
print("\n✅ Class Indices (for React Native app):")
print(json.dumps(train_generator.class_indices, indent=2))

# Build Model
print("\n🏗️ Building MobileNetV2 model...")
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(train_generator.num_classes, activation='softmax')(x)

# Create model
model = Model(inputs=base_model.input, outputs=predictions)

# Compile
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("\n📋 Model Summary:")
model.summary()

# Phase 1: Train top layers
print("\n" + "=" * 60)
print(f"🚀 PHASE 1: Training top layers ({EPOCHS_PHASE1} epochs)")
print("=" * 60)

history_phase1 = model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    validation_data=validation_generator,
    validation_steps=len(validation_generator),
    epochs=EPOCHS_PHASE1,
    verbose=1
)

# Phase 2: Fine-tuning
print("\n" + "=" * 60)
print(f"🔧 PHASE 2: Fine-tuning ({EPOCHS_PHASE2} epochs)")
print("=" * 60)

# Unfreeze base model
base_model.trainable = True

# Freeze early layers, unfreeze last 50 layers
fine_tune_at = len(base_model.layers) - 50
for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

# Recompile with lower learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history_phase2 = model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    validation_data=validation_generator,
    validation_steps=len(validation_generator),
    epochs=EPOCHS_PHASE2,
    verbose=1
)

# Save model
print("\n💾 Saving model...")
model.save('Greenify/tomato_model.h5')
print("✅ Model saved as 'Greenify/tomato_model.h5'")

# Combine histories
history = {
    'accuracy': history_phase1.history['accuracy'] + history_phase2.history['accuracy'],
    'val_accuracy': history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy'],
    'loss': history_phase1.history['loss'] + history_phase2.history['loss'],
    'val_loss': history_phase1.history['val_loss'] + history_phase2.history['val_loss']
}

# Save training history
with open('training_history.json', 'w') as f:
    json.dump(history, f, indent=2)
print("✅ Training history saved as 'training_history.json'")

# Plot results
print("\n📊 Generating training plots...")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

# Plot accuracy
ax1.plot(history['accuracy'], label='Training Accuracy', marker='o')
ax1.plot(history['val_accuracy'], label='Validation Accuracy', marker='s')
ax1.axvline(x=EPOCHS_PHASE1-1, color='red', linestyle='--', label='Fine-tuning starts')
ax1.set_title('Model Accuracy', fontsize=14, fontweight='bold')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Accuracy')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Plot loss
ax2.plot(history['loss'], label='Training Loss', marker='o')
ax2.plot(history['val_loss'], label='Validation Loss', marker='s')
ax2.axvline(x=EPOCHS_PHASE1-1, color='red', linestyle='--', label='Fine-tuning starts')
ax2.set_title('Model Loss', fontsize=14, fontweight='bold')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('training_curves.png', dpi=300, bbox_inches='tight')
print("✅ Training curves saved as 'training_curves.png'")

# Print final results
print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETE!")
print("=" * 60)
print(f"\n📈 Final Results:")
print(f"   Training Accuracy:   {history['accuracy'][-1]*100:.2f}%")
print(f"   Validation Accuracy: {history['val_accuracy'][-1]*100:.2f}%")
print(f"   Training Loss:       {history['loss'][-1]:.4f}")
print(f"   Validation Loss:     {history['val_loss'][-1]:.4f}")

print(f"\n📁 Files Created:")
print(f"   ✅ Greenify/tomato_model.h5 - Trained model")
print(f"   ✅ training_history.json - Training metrics")
print(f"   ✅ training_curves.png - Accuracy/Loss plots")

print(f"\n🔬 Next Steps:")
print(f"   1. Run: python test_model.py")
print(f"   2. Check confusion matrix and per-class accuracy")
print(f"   3. Test with real images from Dataset/")

print("\n" + "=" * 60)

