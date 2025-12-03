import { useEffect } from "react";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthBase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGoogleAuthRedirect() {
  const { setUser } = useAuth();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;

      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;

      if (token) {

        await AsyncStorage.setItem("token", token);

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = await res.json();
        setUser(user);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

   
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url } as any);
    });

    return () => subscription.remove();
  }, []);
}
