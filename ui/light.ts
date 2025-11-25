import { MD3LightTheme as PaperLight } from "react-native-paper";
import { baseTheme } from "./base";

export const lightTheme = {
  ...PaperLight,
  ...baseTheme,
  mode: "light" as const,
  colors: {
    ...PaperLight.colors,

    
    primary: "#C2185B",
     outline: "#C2185B",
    onPrimary: "#FFFFFF",

    secondary: "#6C5CE7",
    onSecondary: "#FFFFFF",
    
mine: "#cfe9ff",
    mineText: "#003b73",

    incoming: "#eeeeee",
    incomingText: "#222222",
    background: "#FFFFFF",
    surface: "#FFFFFF",

    text: "#0F1724",
    textSecondary: "#6B7280",

    border: "#E6E9F0",

    accent: "#046177",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#15161aff",
  },

  components: {
    ...baseTheme.components,

    input: {
      ...baseTheme.components.inputBase,
      backgroundColor: "#FFFFFF",
      borderColor: "#E6E9F0",
    },

    button: {
      ...baseTheme.components.buttonBase,
      backgroundColor: "#C2185B",
    },
  },
};
