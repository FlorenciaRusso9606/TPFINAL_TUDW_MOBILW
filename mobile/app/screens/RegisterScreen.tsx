import React from "react";
import { View, Alert, Linking } from "react-native";
import { TextInput, Button, HelperText, Text, Card, Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "../../schemas/registerSchema";
import api from "../../api/api";
import { useNavigation } from "@react-navigation/native";
import { GoogleButton } from "../components/GoogleButton";
import { useThemeContext } from "../..//context/ThemeContext";

export default function Register() {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await api.post("/auth/register", data);
      Alert.alert("Registro exitoso 🎉", "Revisa tu correo para confirmar tu cuenta.");
      navigation.navigate("CheckEmail" as never);
    } catch (err: any) {
      console.error("Error al registrar usuario", err);
      Alert.alert("Error en el registro", "Verifica tus datos e inténtalo de nuevo.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <Card style={{ padding: 20, borderRadius: 16, backgroundColor: theme.colors.surface }}>
        <Card.Title title="Crear cuenta" titleStyle={{ color: theme.colors.primary }} />
        <Card.Content>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
              <>
                <TextInput
                  label="Correo electrónico"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email" />}
                  error={!!errors.email}
                  style={{ marginBottom: 4 }}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email?.message}
                </HelperText>
              </>
            )}
          />

          {/* Username */}
          <Controller
            control={control}
            name="username"
             render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
              <>
                <TextInput
                  label="Nombre de usuario"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="account" />}
                  error={!!errors.username}
                  style={{ marginBottom: 4 }}
                />
                <HelperText type="error" visible={!!errors.username}>
                  {errors.username?.message}
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

          {/* Botón principal */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{ marginTop: 12, borderRadius: 8 }}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
            {/* Google */}
 {/*<GoogleButton />*/}
           {/* Login link */}
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>¿Ya tienes una cuenta?</Text>
            <Button
              onPress={() => navigation.navigate("Login" as never)}
              compact
              mode="text"
              textColor={theme.colors.primary}
            >
              Inicia sesión aquí
            </Button>
          </View>

          <Divider style={{ marginVertical: 12 }} />

          
        </Card.Content>
      </Card>
    </View>
  );
}
