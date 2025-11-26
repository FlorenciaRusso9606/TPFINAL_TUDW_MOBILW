import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAuth } from "../../context/AuthBase";
import { useNavigation } from "@react-navigation/native";
import ToggleButton from "../components/ToggleButton";
import { useThemeContext } from "../../context/ThemeContext";

export default function PublicHomeScreen() {
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!loading && user) {
      navigation.navigate("Feed" as never);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      {/* Toggle dark/light */}
      <View style={styles.themeToggle}>
        <ToggleButton />
      </View>

      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* HERO CARD */}
      <View
        style={[
          styles.heroContainer,
          {
            backgroundColor: theme.dark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.03)",
          },
        ]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.heroTitle, { color: theme.colors.text }]}
        >
          Bienvenido a Bloop
        </Text>

        <Text
          style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}
        >
          Conéctate con tus amigos y comparte momentos especiales
        </Text>

        <View style={styles.heroButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Login" as never)}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            style={styles.heroButton}
            contentStyle={styles.heroButtonContent}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate("Register" as never)}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSecondary}
            style={[styles.heroButton, { marginTop: 12 }]}
            contentStyle={styles.heroButtonContent}
          >
            Crear Cuenta
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
    alignItems: "center",
  },

  themeToggle: {
    position: "absolute",
    top: 55,
    right: 25,
    zIndex: 20,
  },

  /* LOGO */
  logoContainer: {
    marginBottom: 40,
    width: "85%",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 160,
  },

  /* HERO */
  heroContainer: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },

  heroTitle: {
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.85,
    lineHeight: 22,
    marginBottom: 26,
    paddingHorizontal: 20,
  },

  heroButtons: {
    width: "100%",
  },

  heroButton: {
    borderRadius: 18,
  },

  heroButtonContent: {
    paddingVertical: 10,
  },
});
