import React from "react";
import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      navigation.navigate("Result", { photoUri: uri });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* =============== Lottie Animation =============== */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../../assets/animations/leaf.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>

        {/* =============== Main Content =============== */}
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            <BlurView intensity={70} tint="light" style={styles.blurCard}>
              <Text style={styles.title}>{t("welcome")}</Text>

              {[
                {
                  label: t("takePhoto"),
                  action: () => navigation.navigate("Camera"),
                },
                {
                  label: t("pickGallery"),
                  action: pickImage,
                },
                {
                  label: t("contacts"),
                  action: () => navigation.navigate("Contact"),
                },
                {
                  label: t("settings"),
                  action: () => navigation.navigate("Settings"),
                },
              ].map((btn, i) => (
                <BlurView
                  key={i}
                  intensity={50}
                  tint="light"
                  style={styles.blurButton}
                >
                  <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={styles.label}
                    onPress={btn.action}
                  >
                    {btn.label}
                  </Button>
                </BlurView>
              ))}
            </BlurView>
          </View>

          {/* Tips Section */}
          <View style={[styles.cardContainer, styles.tipsContainer]}>
            <BlurView intensity={70} tint="light" style={styles.blurCard}>
              <Text style={styles.tipsHeading}>Tips for Best Results</Text>
              <Text style={styles.tip}>
                Ensure good lighting when capturing images.
              </Text>
              <Text style={styles.tip}>
                Keep the leaf in focus and fill the frame.
              </Text>
              <Text style={styles.tip}>Hold the phone steady for clear images.</Text>
            </BlurView>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 Greenify. Powered by AI Technology.</Text>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  animationContainer: {
    position: "absolute",
    top: 60,
    alignItems: "center",
    width: "100%",
  },
  animation: {
    width: width * 0.4,
    height: width * 0.4,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: width * 0.35, // <-- pushes buttons down beneath animation
  },
  cardContainer: {
    width: "85%",
    maxWidth: 380,
    borderRadius: 16,
    overflow: "hidden",
  },
  blurCard: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#91e195ff",
  },
  blurButton: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: "transparent",
    elevation: 0,
    width: "100%",
  },
  label: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  tipsContainer: { marginTop: 35 },
  tipsHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  tip: {
    color: "#e0e0e0",
    fontSize: 12,
    marginVertical: 2,
    textAlign: "center",
  },
  footer: {
    fontSize: 12,
    color: "#b0b0b0",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
  },
});