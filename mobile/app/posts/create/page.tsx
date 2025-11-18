import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useThemeContext } from "../../../context/ThemeContext";

import CrearPost from "../../components/CrearPost";
import ToggleButton from "../../components/ToggleButton";

export default function CreatePostPage() {
  const { theme } = useThemeContext();

  return (
    <View style={styles.container}>
      {/* Botón de tema */}
      <View style={styles.toggleContainer}>
        <ToggleButton />
      </View>

      {/* Título */}
      <View style={styles.header}>
        <Text variant="headlineSmall">Crear Post</Text>
        <Text style={{ color: theme.colors.secondary }}>
          — comparte novedades con la comunidad
        </Text>
      </View>

      {/* Formulario */}
      <CrearPost />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },
  toggleContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    gap: 8,
  },
});
