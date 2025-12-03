import React from "react";
import { View, Alert, StyleSheet, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Button, HelperText, Text, Card, Divider } from "react-native-paper";
import { useAuth } from "../../context/AuthBase";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import { loginSchema, loginData } from "../../schemas/loginSchema";
import { GoogleButton } from "../components/GoogleButton";
import { useThemeContext } from "../../context/ThemeContext";
import ToggleButton from "../components/ToggleButton";
import { Eye, EyeClosed } from "lucide-react-native";
import { useState } from "react";
type NavigationProps = { navigate: (screen: string) => void };

export default function LoginScreen() {
  const { theme } = useThemeContext();
  const navigation = useNavigation<NavigationProps>();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginData) => {
    try {
      const res = await api.post("/auth/login", data, { withCredentials: true });

      if (res.data.token) {
        await AsyncStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        Alert.alert("Inicio de sesión exitoso 🎉");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      Alert.alert("Error", "Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background
    }}>
      <View style={styles.themeToggle}>
        <ToggleButton />
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: theme.colors.surface,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme.colors.primary,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Iniciar Sesión
        </Text>

        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Email o usuario"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                left={<TextInput.Icon icon="account" />}
                error={!!errors.identifier}
                style={{ marginBottom: 4 }}
              />
              <HelperText type="error" visible={!!errors.identifier}>
                {errors.identifier?.message}
              </HelperText>
            </View>
          )}
        />

       <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Contraseña"
                mode="outlined"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                left={<TextInput.Icon icon="lock" />}
                error={!!errors.password}
                style={{ marginBottom: 4 }}
                 right={
          <TextInput.Icon
            onPress={() => setShowPassword((prev) => !prev)}
            icon={() =>
              showPassword ? (
                <EyeClosed size={22} color={theme.colors.onSurfaceVariant} />
              ) : (
                <Eye size={22} color={theme.colors.onSurfaceVariant} />
              )
            }
          />
        }
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password?.message}
              </HelperText>
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: 12, borderRadius: 8 }}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>

        <Divider style={{ marginVertical: 12 }} />

        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>¿No tienes cuenta?</Text>
          <Button
            onPress={() => navigation.navigate("Register")}
            compact
            mode="text"
            textColor={theme.colors.primary}
          >
            Regístrate aquí
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

  logoContainer: {
    marginBottom: 40,
    width: "85%",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 160,
  },
})