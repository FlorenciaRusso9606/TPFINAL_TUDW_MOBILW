import  { useEffect, useState } from "react";
import { View, ImageBackground, StyleSheet, ActivityIndicator } from "react-native";
import { useThemeContext } from "../../../context/ThemeContext"; 
import api from "../../../api/api";

interface Props {
  weather?: any | null;
  children?: React.ReactNode;
  overlayOpacity?: number;
  imageOpacity?: number;
  postId?: string;
}

export default function WeatherBackground({
  weather,
  children,
  overlayOpacity = 0,
  imageOpacity = 1,
  postId,
}: Props) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localWeather, setLocalWeather] = useState<any | null>(weather ?? null);
  const {theme} = useThemeContext();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Si no hay clima pasado como prop, intentar obtenerlo desde el post
        if ((!weather || !weather.current) && postId) {
          const res = await api.get(`/posts/${postId}`);
          const payload = res.data?.data;
          if (payload?.weather) setLocalWeather(payload.weather);
        }

        const effectiveWeather = localWeather || weather;
        if (!effectiveWeather) return;

        const weatherMain =
          effectiveWeather.current?.weather?.[0]?.main ||
          effectiveWeather.current?.weatherMain ||
          effectiveWeather.current?.condition?.text ||
          effectiveWeather.current?.description ||
          effectiveWeather.current?.summary ||
          effectiveWeather.current?.icon ||
          effectiveWeather?.location?.weather ||
          effectiveWeather?.location?.city ||
          effectiveWeather?.location?.name ||
          null;

        const map: Record<string, string> = {
          Clear: "sunny sky",
          Clouds: "cloudy sky",
          Rain: "rain clouds",
          Drizzle: "light rain",
          Snow: "snow landscape",
          Thunderstorm: "storm lightning",
          Mist: "misty landscape",
          Smoke: "hazy sky",
          Haze: "hazy sky",
          Dust: "dusty landscape",
          Fog: "foggy landscape",
          Sand: "desert sand",
          Ash: "volcanic ash sky",
          Squall: "stormy sky",
          Tornado: "tornado storm",
        };

        const baseMapped = map[weatherMain] || weatherMain || "weather";
        const query = `${baseMapped}, landscape`;

        setLoading(true);
        try {
          const res = await api.get("/photo", { params: { query } });
          const url = res.data?.url;
          if (mounted && url) {
            setBgUrl(url);
            setLoading(false);
            return;
          }
        } catch {
          // fallback Unsplash
          if (mounted) {
            const fallback = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
            setBgUrl(fallback);
          }
        }
      } catch (e) {
        console.warn("WeatherBackground error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [weather, postId, localWeather]);

  return (
    <View style={styles.container}>
      {bgUrl && (
        <ImageBackground
          source={{ uri: bgUrl }}
          resizeMode="cover"
          style={[styles.image, { opacity: imageOpacity }]}
        >
          {overlayOpacity > 0 && (
            <View
              style={[
                styles.overlay,
                { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
              ]}
            />
          )}
          <View style={styles.content}>{children}</View>
        </ImageBackground>
      )}
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  loader: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 3,
  },
});
