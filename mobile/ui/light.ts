import { MD3LightTheme as PaperLight } from "react-native-paper";
import { baseTheme } from "./base";

export const lightTheme = {
  ...PaperLight,
  ...baseTheme,
  mode: "light" as const,
  colors: {
    ...PaperLight.colors,
    primary: "#1976d2",
    onPrimary: "#ffffff",
    primaryContainer: "#e3f2fd",
    secondary: "#9c27b0",
    onSecondary: "#ffffff",
    background: "#f5f5f5",
    surface: "#ffffff",
    onSurface: "#000000",
    outline: "#bdbdbd",
    error: "#ef5350",
    success: "#66bb6a",
    warning: "#ffb300",
    textPrimary: "#000000",
    textSecondary: "#555555",
  },
  components: {
    ...baseTheme.components,
    input: {
      ...baseTheme.components.inputBase,
      backgroundColor: "#ffffff",
      borderColor: "#bdbdbd",
    },
    button: {
      ...baseTheme.components.buttonBase,
      backgroundColor: "#1976d2",
    },
  },
};
