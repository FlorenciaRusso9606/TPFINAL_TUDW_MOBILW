import React from "react";
import { View, Alert, Image, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Text, Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "../../schemas/registerSchema";
import api from "../../api/api";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../context/ThemeContext";
import ToggleButton from "../components/ToggleButton";
import { GoogleButton } from "../components/GoogleButton";
import { Eye, EyeClosed } from "lucide-react-native";
import { useState } from "react";

export default function Register() {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
         const { confirmPassword, ...rest } = data; 

    try {
      await api.post("/auth/register", rest);
      Alert.alert("Registro exitoso 🎉", "Revisa tu correo para confirmar tu cuenta.");
      navigation.navigate("CheckEmail" as never);
    } catch (err) {
      console.error("Error al registrar usuario", err);
      Alert.alert("Error", "Verifica tus datos e inténtalo de nuevo.");
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
      
      {/* Toggle para tema */}
      <View style={styles.themeToggle}>
        <ToggleButton />
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Contenedor principal (igual al login) */}
      <View style={{
        padding: 20,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        width: "100%",
        maxWidth: 400
      }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme.colors.primary,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Crear cuenta
        </Text>

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
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
            </View>
          )}
        />

        {/* Username */}
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
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
            </View>
          )}
        />

        {/* Displayname */}
        <Controller
          control={control}
          name="displayname"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label="Nombre a mostrar"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
                left={<TextInput.Icon icon="account-circle" />}
                error={!!errors.displayname}
                style={{ marginBottom: 4 }}
              />
              <HelperText type="error" visible={!!errors.displayname}>
                {errors.displayname?.message}
              </HelperText>
            </View>
          )}
        />

        {/* Password */}
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

    <Controller
            control={control}
            name="confirmPassword"
             render={({ field: { onChange, onBlur, value } }: { field: { onChange: (value: string) => void; onBlur: () => void; value: string } }) => (
              <View>
                <TextInput
                  label="Repetir contraseña"
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  left={<TextInput.Icon icon="lock" />}
                   right={
          <TextInput.Icon
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            icon={() =>
              showConfirmPassword ? (
                <EyeClosed size={22} color={theme.colors.onSurfaceVariant} />
              ) : (
                <Eye size={22} color={theme.colors.onSurfaceVariant} />
              )
            }
          />
        }
                  error={!!errors.confirmPassword}
                  style={{ marginBottom: 4 }}
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword?.message}
                </HelperText>
              </View>
            )}
          />

        <Divider style={{ marginVertical: 12 }} />
   <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: 12, borderRadius: 8 }}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>
        {/* Link login */}
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>¿Ya tienes una cuenta?</Text>
          

        
  
          {/* Botón principal */}
          <Button
            onPress={() => navigation.navigate("Login" as never)}
            compact
            mode="text"
            textColor={theme.colors.primary}
          >
            Inicia sesión aquí
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    position: "absolute",
    top: 55,
    right: 25,
    zIndex: 20,
  },

  logoContainer: {
    width: "85%",
    alignItems: "center",
  },

  logo: {
    width: "100%",
    height: 160,
  },
});
