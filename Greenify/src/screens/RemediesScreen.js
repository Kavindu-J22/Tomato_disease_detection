import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import remedies from "../data/remedies.json";

export default function RemediesScreen({ route }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "si" ? "si" : "en";

  // Initial selection
  const initialKey = route?.params?.selectedKey || "healthy";
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const current = remedies[selectedKey][lang];

  useEffect(() => {
    if (route?.params?.selectedKey) {
      setSelectedKey(route.params.selectedKey);
    }
  }, [route?.params?.selectedKey]);

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <BlurView intensity={70} tint="light" style={styles.blurCard}>
            <Text style={styles.title}>Tomato Leaf Diseases</Text>

            {/* Disease selector buttons with frosted blur */}
            <View style={styles.row}>
              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.label}
                  onPress={() => setSelectedKey("healthy")}
                >
                  Healthy
                </Button>
              </BlurView>

              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.label}
                  onPress={() => setSelectedKey("early_blight")}
                >
                  Early Blight
                </Button>
              </BlurView>

              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.label}
                  onPress={() => setSelectedKey("leaf_mold")}
                >
                  Leaf Mold
                </Button>
              </BlurView>

              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.label}
                  onPress={() => setSelectedKey("late_blight")}
                >
                  Late Blight
                </Button>
              </BlurView>
              
              <BlurView intensity={50} tint="light" style={styles.blurButton}>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={styles.label}
                  onPress={() => setSelectedKey("bacterial_spot")}
                >
                  Bacterial Spot
                </Button>
              </BlurView>
            </View>

            {/* Remedy details card */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.disease}>{current.disease}</Text>
                <Text style={styles.section}>Treatment</Text>
                <Text>{current.remedy}</Text>
                <Text style={styles.section}>Prevention</Text>
                <Text>{current.prevention}</Text>
              </Card.Content>
            </Card>
          </BlurView>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  blurCard: {
    width: "95%",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#9ce99fff",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ ensures new row if many buttons
    justifyContent: "center",
    marginBottom: 16,
  },
  blurButton: {
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: "transparent", // frost-glass look
    elevation: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)", // translucent card
    borderRadius: 12,
  },
  disease: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  section: {
    marginTop: 10,
    fontWeight: "bold",
  },
});