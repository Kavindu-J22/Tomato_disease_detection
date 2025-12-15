import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2E7D32",       // deep green
    secondary: "#81C784",     // lighter green
    accent: "#FF9800",        // orange for warnings/retake
    background: "#F1F8F4",    // soft greenish background
    surface: "#FFFFFF",       // white cards
    text: "#1B5E20",          // dark green text
  },
  roundness: 10,              // rounded corners for buttons/cards
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: "System", fontWeight: "400" },
    medium: { fontFamily: "System", fontWeight: "600" },
    bold: { fontFamily: "System", fontWeight: "700" },
  },
};