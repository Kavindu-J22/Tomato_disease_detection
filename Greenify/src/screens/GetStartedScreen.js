import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { BlurView } from "expo-blur";

export default function GetStartedScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/getstarted.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Subtler Lightening Layer */}
      <View style={styles.lightenLayer} />

      {/* Slight translucent dark overlay, toned down */}
      <View style={styles.overlay}>
        <View style={{ flex: 6 }} />

        <View style={styles.buttonGroup}>
          <BlurView intensity={50} tint="light" style={styles.blurButton}>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={styles.label}
              onPress={() => navigation.replace("Home")}
            >
              Get Started
            </Button>
          </BlurView>
        </View>

        <View style={{ flex: 1 }} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },

  // Reduced opacity — background now pops
  lightenLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // Softer dark overlay; just enough for text contrast
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.12)", 
  },

  buttonGroup: {
    alignItems: "center",
    width: "100%",
  },

  blurButton: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    width: 230,
    alignSelf: "center",
  },

  button: {
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: "transparent",
    elevation: 0,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});