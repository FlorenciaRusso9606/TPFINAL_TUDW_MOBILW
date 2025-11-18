import React from "react";
import { View, Alert } from "react-native";
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

type NavigationProps = { navigate: (screen: string) => void };

export default function LoginScreen() {
  const { theme } = useThemeContext();
  const navigation = useNavigation<NavigationProps>();
  const { setUser } = useAuth();

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
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: theme.colors.background }}>
      <Card style={{ padding: 20, borderRadius: 16, backgroundColor: theme.colors.surface }}>
        <Card.Title title="Iniciar Sesión" titleStyle={{ color: theme.colors.primary }} />
        <Card.Content>
          {/* Identifier (usuario o email) */}
          <Controller
            control={control}
            name="identifier"
           render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
              <>
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
              </>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
             render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
              <>
                <TextInput
                  label="Contraseña"
                  mode="outlined"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  left={<TextInput.Icon icon="lock" />}
                  error={!!errors.password}
                  style={{ marginBottom: 4 }}
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password?.message}
                </HelperText>
              </>
            )}
          />

          {/* Botón de login */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{ marginTop: 12, borderRadius: 8 }}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>

          {/* Divider y botón de Google */}
          <Divider style={{ marginVertical: 12 }} />
          {/*<GoogleButton />*/}

          {/* Enlace a registro */}
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
        </Card.Content>
      </Card>
    </View>
  );
}
