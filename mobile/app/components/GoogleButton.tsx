import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthBase";
import { useThemeContext } from "../../context/ThemeContext";

WebBrowser.maybeCompleteAuthSession();

export const GoogleButton: React.FC = () => {
  const { theme } = useThemeContext();
  const { setUser } = useAuth();

  // backend desde app config (app.config.js / app.json -> extra.apiUrl)
  const backend = (Constants.expoConfig as any)?.extra?.apiUrl as string;
  if (!backend) console.warn("GoogleButton: faltó extra.apiUrl en app.config / app.json");

  const goToGoogle = async () => {
    // Deep link que expondrá expo: lared://auth
    const redirectUrl = Linking.createURL("auth"); // exp://.../--/auth?...
    const authUrl = `${backend}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;

    try {
      // Abre el navegador y espera la redirección al redirectUrl
      await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      // la redirección será manejada por Linking listener más abajo
    } catch (err) {
      console.error("Error abriendo auth session:", err);
    }
  };

  // Listener para capturar la URL que nos manda el backend con ?token=...
  useEffect(() => {
    const onUrl = async ({ url }: { url: string }) => {
      try {
        const parsed = Linking.parse(url);
        const token = (parsed.queryParams as any)?.token as string | undefined;
        if (token) {
          await AsyncStorage.setItem("token", token);
          // opcional: pedir /api/auth/me si querés el user desde backend
          try {
            const res = await fetch(`${backend}/api/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const user = await res.json();
              setUser(user);
            }
          } catch (err) {
            console.warn("No se pudo obtener user desde /api/auth/me:", err);
          }
        }
      } catch (err) {
        console.error("Error procesando deep link:", err);
      }
    };

    const sub = Linking.addEventListener("url", onUrl);
    return () => sub.remove();
  }, []);

  return (
    <TouchableOpacity
      onPress={goToGoogle}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surface,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: theme.spacing(2),
      }}
    >
      <Text style={{ color: theme.colors.onSurface, fontWeight: "500", fontSize: 16 }}>
        Continuar con Google
      </Text>
    </TouchableOpacity>
  );
};
