import { useThemeContext } from "../../context/ThemeContext";
import { View, StyleSheet, Text } from "react-native";
import { SunMedium, Moon } from "lucide-react-native";
import Button from "../components/Button";

const ToggleButton = () => {
  const { theme, toggleDarkMode, darkMode } = useThemeContext();

  return (
    <View style={styles.wrapper}>
      <Button
        onPress={toggleDarkMode}
        style={[
          styles.button,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.content}>
          {darkMode ? (
            <SunMedium color={theme.colors.primary} size={20} />
          ) : (
            <Moon color={theme.colors.primary} size={20} />
          )}

          <Text style={[styles.text, { color: theme.colors.primary }]}>
            {darkMode ? "Modo Oscuro" : "Modo Claro"}
          </Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 130,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, 
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ToggleButton;
