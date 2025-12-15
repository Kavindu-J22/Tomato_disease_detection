import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ImageBackground, Alert } from "react-native";
import { Text } from "react-native-paper";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { tomatoModel } from "../utils/modelHelper";

export default function ResultScreen({ route, navigation }) {
  const { photoUri } = route.params || {};
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const analyzeImage = async () => {
      if (!photoUri) {
        setError("No photo provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Load model if not already loaded
        if (!tomatoModel.isLoaded) {
          await tomatoModel.loadModel();
        }

        // Make prediction
        const result = await tomatoModel.predict(photoUri);
        
        if (mounted) {
          setPrediction(result);
          
          // Haptic feedback based on result
          if (result.label === "healthy") {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }
      } catch (err) {
        console.error("Analysis error:", err);
        if (mounted) {
          setError("Failed to analyze image. Please try again.");
          Alert.alert(
            "Analysis Error", 
            "Failed to analyze the image. This might be due to model loading issues or image processing problems. Please try again.",
            [{ text: "OK" }]
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to show loading animation
    const timer = setTimeout(() => {
      analyzeImage();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [photoUri]);

  const handleRetakePhoto = () => {
    navigation.navigate("Camera");
  };

  const handleSeeRemedies = () => {
    if (prediction) {
      navigation.navigate("Remedies", { selectedKey: prediction.label });
    }
  };

  const formatDiseaseName = (label) => {
    return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (error) {
    return (
      <ImageBackground
        source={require("../../assets/bg.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.cardContainer}>
            <BlurView intensity={70} tint="light" style={styles.blurCard}>
              {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.preview} />
              )}
              
              <LottieView
                source={require("../../assets/animations/error.json")}
                autoPlay
                loop={false}
                style={styles.errorLottie}
              />
              
              <Text style={styles.errorTitle}>Analysis Failed</Text>
              <Text style={styles.errorText}>{error}</Text>
              
              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRetakePhoto}
                >
                  <Text style={styles.label}>Retake Photo</Text>
                </TouchableOpacity>
              </BlurView>

              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.label}>Back to Home</Text>
                </TouchableOpacity>
              </BlurView>
            </BlurView>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <BlurView intensity={70} tint="light" style={styles.blurCard}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.preview} />
            ) : (
              <Text style={styles.info}>No photo received 😅</Text>
            )}

            {!prediction && isLoading ? (
              <>
                <LottieView
                  source={require("../../assets/animations/leaf-loading.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text style={styles.analyzingText}>Analyzing leaf photo...</Text>
                <Text style={styles.analyzingSubtext}>Processing image with AI model</Text>
              </>
            ) : prediction ? (
              <>
                <LottieView
                  source={
                    prediction.label === "healthy" 
                      ? require("../../assets/animations/success.json")
                      : require("../../assets/animations/warning.json")
                  }
                  autoPlay
                  loop={false}
                  style={styles.resultLottie}
                />
                
                <Text style={[
                  styles.result,
                  prediction.label === "healthy" ? styles.healthyText : styles.diseaseText
                ]}>
                  {formatDiseaseName(prediction.label)}
                </Text>
                
                <Text style={styles.confidence}>
                  Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </Text>

                <BlurView intensity={50} tint="light" style={styles.blurButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSeeRemedies}
                  >
                    <Text style={styles.label}>See Remedies</Text>
                  </TouchableOpacity>
                </BlurView>

                <BlurView intensity={50} tint="light" style={styles.blurButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleRetakePhoto}
                  >
                    <Text style={styles.label}>Retake Photo</Text>
                  </TouchableOpacity>
                </BlurView>

                <Text style={styles.disclaimer}>
                  ⚠ This result was generated by AI and may not be accurate. Please verify
                  with experts if needed.
                </Text>
              </>
            ) : null}
          </BlurView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  blurCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 280,
    marginBottom: 20,
    borderRadius: 12,
  },
  result: {
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  healthyText: {
    color: "#4CAF50", // Green for healthy
  },
  diseaseText: {
    color: "#FF9800", // Orange for diseases
  },
  confidence: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: "italic",
    color: "#facc15",
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 13,
    color: "#ff6b6b",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 4,
    lineHeight: 16,
  },
  info: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  blurButton: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  lottie: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  resultLottie: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  errorLottie: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#91e195",
    textAlign: "center",
    marginBottom: 5,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: "#e0e0e0",
    textAlign: "center",
    fontStyle: "italic",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
});