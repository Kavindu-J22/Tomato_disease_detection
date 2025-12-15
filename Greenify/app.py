from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# 1. Load the trained model
# Ensure 'tomato_model.h5' is in the same folder as this script
print("Loading model...")
model = tf.keras.models.load_model('tomato_model.h5')
print("Model loaded!")

# 2. EXACT MAPPING based on your provided indices
# 0: Tomato_Bacterial_spot -> matches remedies.json key "bacterial_spot"
# 1: Tomato_Early_blight   -> matches remedies.json key "early_blight"
# 2: Tomato_Late_blight    -> matches remedies.json key "late_blight"
# 3: Tomato_Leaf_Mold      -> matches remedies.json key "leaf_mold"
# 4: Tomato_healthy        -> matches remedies.json key "healthy"

CLASS_NAMES = [
    "bacterial_spot",  # Index 0
    "early_blight",    # Index 1
    "late_blight",     # Index 2
    "leaf_mold",       # Index 3
    "healthy"          # Index 4
]

def prepare_image(image_bytes):
    # Resize to match the training size (224x224)
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224)) 
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'photo' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['photo']
    
    try:
        # Process image
        processed_image = prepare_image(file.read())
        
        # Predict
        prediction = model.predict(processed_image)
        
        # Extract result
        confidence = float(np.max(prediction))
        class_idx = np.argmax(prediction)
        
        # Map index to disease name
        result_key = CLASS_NAMES[class_idx]
        
        print(f"Prediction: Index {class_idx} ({result_key}) with confidence {confidence:.2f}")

        return jsonify({
            'label': result_key,
            'confidence': confidence
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # host='0.0.0.0' makes the server accessible to other devices (like your phone) on the network
    app.run(host='0.0.0.0', port=5000, debug=True)