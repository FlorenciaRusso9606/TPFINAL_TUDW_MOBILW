import { ThemeProviderCustom, useThemeContext } from "../../context/ThemeContext";
import { View, StyleSheet, Text } from "react-native";
import { SunMedium , Moon  } from 'lucide-react-native';
import Button from "../components/Button"
const ToggleButton = () =>{

  const { theme, toggleDarkMode, darkMode } = useThemeContext();

  return (
    <View
      style={[
        styles.container,
        
      ]}
    >
      <Text style={{ color: theme.colors.primary }}>Modo: {darkMode ? "Oscuro" : "Claro"}</Text>
      <Button children={darkMode? <SunMedium color={theme.colors.primary} /> : <Moon color={theme.colors.primary}/> } onPress={toggleDarkMode} />
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
            flex: 1,
    alignItems: "center",
    justifyContent: "center",
    }
})

export default ToggleButton