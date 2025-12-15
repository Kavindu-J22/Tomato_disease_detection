
// Model class names - update these based on your model's training
export const CLASS_NAMES = {
  0: 'healthy',
  1: 'early_blight', 
  2: 'leaf_mold',
  3: 'late_blight',
  4: 'bacterial_spot'
};

export class TomatoModel {
  constructor() {
    this.model = null;
    this.isLoaded = false;
  }

  async loadModel() {
    try {
      // Load the model from local assets
      const modelJson = require('../../assets/model/tomato_model.json');
      const modelWeights = require('../../assets/model/tomato_model_weights.bin');
      
      this.model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      this.isLoaded = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async predict(imageUri) {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded');
    }

    try {
      // Preprocess the image
      const processedTensor = await this.preprocessImage(imageUri);
      
      // Make prediction
      const prediction = this.model.predict(processedTensor);
      const scores = await prediction.data();
      
      // Get the highest confidence class
      const maxScore = Math.max(...scores);
      const predictedClassIndex = scores.indexOf(maxScore);
      
      return {
        label: CLASS_NAMES[predictedClassIndex] || 'unknown',
        confidence: maxScore,
        allScores: scores
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  async preprocessImage(imageUri) {
    try {
      // Read and decode image
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const rawImageData = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(rawImageData);
      
      // Resize to expected input size (adjust based on your model)
      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
      
      // Normalize pixel values to [0, 1]
      const normalizedImage = resizedImage.div(255.0);
      
      // Add batch dimension
      const batchedImage = normalizedImage.expandDims(0);
      
      // Clean up
      tf.dispose([imageTensor, resizedImage, normalizedImage]);
      
      return batchedImage;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
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