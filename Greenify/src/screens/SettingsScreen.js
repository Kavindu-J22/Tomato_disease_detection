import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <BlurView intensity={70} tint="light" style={styles.blurCard}>
            <Text style={styles.title}>{t("language")}</Text>

            <BlurView intensity={50} tint="light" style={styles.blurButton}>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.label}
                onPress={() => i18n.changeLanguage("en")}
              >
                English
              </Button>
            </BlurView>

            <BlurView intensity={50} tint="light" style={styles.blurButton}>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.label}
                onPress={() => i18n.changeLanguage("si")}
              >
                සිංහල
              </Button>
            </BlurView>

            <BlurView intensity={50} tint="light" style={styles.blurButton}>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.label}
                onPress={() => i18n.changeLanguage("ta")}
              >
                தமிழ்
              </Button>
            </BlurView>

            <Text style={styles.note}>
              🌿 Tip: Everything will update automatically after you choose a language.
            </Text>
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
    width: "85%",
    maxWidth: 380,
    borderRadius: 16,
    overflow: "hidden",
  },
  blurCard: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#91e195",
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
  note: {
    marginTop: 18,
    fontSize: 12,
    color: "#e0e0e0",
    textAlign: "center",
    lineHeight: 16,
    fontStyle: "italic",
  },
});