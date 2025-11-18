import { MD3DarkTheme as PaperDark } from "react-native-paper";
import { baseTheme } from "./base";

export const darkTheme = {
  ...PaperDark,
  ...baseTheme,
  mode: "dark" as const,
  colors: {
    ...PaperDark.colors,
    primary: "#90caf9",
    onPrimary: "#000000",
    primaryContainer: "#0d47a1",
    secondary: "#ce93d8",
    onSecondary: "#000000",
    background: "#121212",
    surface: "#1e1e1e",
    onSurface: "#ffffff",
    outline: "#333333",
    error: "#ef5350",
    success: "#66bb6a",
    warning: "#ffb300",
    textPrimary: "#ffffff",
    textSecondary: "#bbbbbb",
  },
  components: {
    ...baseTheme.components,
    input: {
      ...baseTheme.components.inputBase,
      backgroundColor: "#1e1e1e",
      borderColor: "#333333",
    },
    button: {
      ...baseTheme.components.buttonBase,
      backgroundColor: "#90caf9",
    },
  },
}as const; 
