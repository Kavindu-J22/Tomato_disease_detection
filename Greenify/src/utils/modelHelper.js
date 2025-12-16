import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';
import { Asset } from 'expo-asset';

// Model class names - matches the training indices from mobilenet.py
// 0: Tomato_Bacterial_spot, 1: Tomato_Early_blight, 2: Tomato_Late_blight,
// 3: Tomato_Leaf_Mold, 4: Tomato_healthy
export const CLASS_NAMES = {
  0: 'bacterial_spot',
  1: 'early_blight',
  2: 'late_blight',
  3: 'leaf_mold',
  4: 'healthy'
};

export class TomatoModel {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.isTfReady = false;
  }

  async loadModel() {
    try {
      console.log('🔄 Initializing TensorFlow.js...');

      // Initialize TensorFlow.js for React Native
      if (!this.isTfReady) {
        await tf.ready();
        this.isTfReady = true;
        console.log('✅ TensorFlow.js ready');
      }

      console.log('📦 Loading model from assets...');

      // Load model using Asset API for better compatibility
      const modelJsonAsset = Asset.fromModule(require('../../assets/model/model.json'));
      await modelJsonAsset.downloadAsync();

      // Load the model
      const modelPath = modelJsonAsset.localUri.replace('model.json', '');
      this.model = await tf.loadLayersModel(`file://${modelPath}model.json`);

      this.isLoaded = true;
      console.log('✅ Model loaded successfully');
      console.log('📊 Model input shape:', this.model.inputs[0].shape);
      console.log('📊 Model output shape:', this.model.outputs[0].shape);
    } catch (error) {
      console.error('❌ Error loading model:', error);
      console.error('Error details:', error.message);
      throw new Error(`Failed to load model: ${error.message}`);
    }
  }

  async predict(imageUri) {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded. Please call loadModel() first.');
    }

    try {
      console.log('🔮 Starting prediction...');

      // Preprocess the image
      const processedTensor = await this.preprocessImage(imageUri);

      // Make prediction
      console.log('🧠 Running model inference...');
      const prediction = this.model.predict(processedTensor);
      const scores = await prediction.data();

      // Clean up prediction tensor
      tf.dispose(prediction);
      tf.dispose(processedTensor);

      // Get the highest confidence class
      const maxScore = Math.max(...scores);
      const predictedClassIndex = scores.indexOf(maxScore);
      const predictedLabel = CLASS_NAMES[predictedClassIndex] || 'unknown';

      console.log('✅ Prediction complete!');
      console.log(`📊 Predicted: ${predictedLabel} (${(maxScore * 100).toFixed(2)}%)`);
      console.log('📊 All scores:', Array.from(scores).map((s, i) =>
        `${CLASS_NAMES[i]}: ${(s * 100).toFixed(2)}%`
      ).join(', '));

      return {
        label: predictedLabel,
        confidence: maxScore,
        allScores: Array.from(scores)
      };
    } catch (error) {
      console.error('❌ Prediction error:', error);
      console.error('Error details:', error.message);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  async preprocessImage(imageUri) {
    try {
      console.log('🖼️ Preprocessing image:', imageUri);

      // Read image as base64
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Decode base64 to array buffer
      const imgBuffer = Uint8Array.from(atob(imgB64), c => c.charCodeAt(0));

      // Decode JPEG
      const rawImageData = jpeg.decode(imgBuffer, { useTArray: true });

      // Create tensor from raw image data
      const imageTensor = tf.tensor3d(rawImageData.data, [
        rawImageData.height,
        rawImageData.width,
        4 // RGBA
      ]);

      // Remove alpha channel (RGBA -> RGB)
      const rgbImage = imageTensor.slice([0, 0, 0], [-1, -1, 3]);

      // Resize to model input size (224x224)
      const resizedImage = tf.image.resizeBilinear(rgbImage, [224, 224]);

      // Normalize pixel values to [0, 1]
      const normalizedImage = resizedImage.div(255.0);

      // Add batch dimension [1, 224, 224, 3]
      const batchedImage = normalizedImage.expandDims(0);

      // Clean up intermediate tensors
      tf.dispose([imageTensor, rgbImage, resizedImage, normalizedImage]);

      console.log('✅ Image preprocessed, shape:', batchedImage.shape);

      return batchedImage;
    } catch (error) {
      console.error('❌ Image preprocessing error:', error);
      console.error('Error details:', error.message);
      throw new Error(`Failed to preprocess image: ${error.message}`);
    }
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
}

// Singleton instance
export const tomatoModel = new TomatoModel();