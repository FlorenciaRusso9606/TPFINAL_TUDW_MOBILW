import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useAuth } from "../../context/AuthBase";
import { useNavigation } from "@react-navigation/native";
import ToggleButton from "../components/ToggleButton";
import { useThemeContext } from "../../context/ThemeContext";

export default function PublicHomeScreen() {
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const { theme } = useThemeContext(); // <-- usamos tu theme

  // Redirigir si hay usuario logueado
  useEffect(() => {
    if (!loading && user) {
      navigation.navigate("Feed" as never);
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.themeToggle}>
        <ToggleButton />
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={{ alignItems: "center" }}>
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.text }]}
          >
            Bienvenido a "La Red"
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Conéctate con tus amigos y comparte momentos especiales
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Login" as never)}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              style={styles.button}
            >
              Iniciar Sesión
            </Button>

            <Button
              mode="contained"
              onPress={() => navigation.navigate("Register" as never)}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              style={styles.button}
            >
              Crear Cuenta
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    marginVertical: 6,
  },
});
