import React from "react";
import { View, StyleSheet, Linking, ImageBackground } from "react-native";
import { Text, Button } from "react-native-paper";
import { BlurView } from "expo-blur";

export default function ContactScreen() {
  const email = "info@doa.gov.lk";
  const phone = "081-2388011";

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}?subject=LeafCare%20Support`);
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <BlurView intensity={70} tint="light" style={styles.blurCard}>
            <Text style={styles.title}>Agricultural Support</Text>

            <Text style={styles.info}>
              Worried about your tomato leaves?
            </Text>

             <Text style={styles.info}>
              You can reach the Department directly   via:
            </Text>

            <View style={styles.contactBox}>
              <Text style={styles.contact}>Email: {email}</Text>
              <Text style={styles.contact}>Phone: {phone}</Text>
            </View>

            {/* Email button */}
            <BlurView intensity={50} tint="light" style={styles.blurButton}>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.label}
                onPress={handleEmail}
              >
                 Send Email
              </Button>
            </BlurView>

            {/* Phone button */}
            <BlurView intensity={50} tint="light" style={styles.blurButton}>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.label}
                onPress={handlePhone}
              >
                 Call Us
              </Button>
            </BlurView>

            <Text style={styles.footer}>
              🌱 Note: All advisory services are provided by   the Department of 
              Agriculture of Sri Lanka.     Availability and response times may 
              vary by region.
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
    width: "86%",
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
    marginBottom: 16,
    textAlign: "center",
    color: "#91e195",
  },
  info: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  contactBox: {
    marginVertical: 10,
    alignItems: "center",
  },
  contact: {
    fontSize: 14,
    color: "#facc15",
    fontWeight: "600",
    marginVertical: 2,
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
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#ff6b6b",
    textAlign: "center",
    lineHeight: 16,
  },
});