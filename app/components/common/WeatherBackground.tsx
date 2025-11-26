import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import api from "../../../api/api";
import { weatherCache } from "../../utils/weatherCache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function WeatherBackground({ postId, children }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadWeather = async () => {
      if (weatherCache[postId]) {
        setWeather(weatherCache[postId]);
        setLoading(false);
        return;
      }

      const stored = await AsyncStorage.getItem(`weather:${postId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        weatherCache[postId] = parsed;
        if (mounted) {
          setWeather(parsed);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get(`/posts/${postId}`);
        const payload = res.data?.data;

        if (payload?.weather) {
          weatherCache[postId] = payload.weather;
          await AsyncStorage.setItem(
            `weather:${postId}`,
            JSON.stringify(payload.weather)
          );
          if (mounted) setWeather(payload.weather);
        }
      } catch (e) {
        console.warn("WeatherBackground error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadWeather();
    return () => {
      mounted = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <View style={{ minHeight: 60, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }


  return <View style={{ backgroundColor: 'transparent' }}>{children}</View>;
}
