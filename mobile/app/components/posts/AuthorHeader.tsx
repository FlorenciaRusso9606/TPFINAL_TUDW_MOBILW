import  { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text, ActivityIndicator, Card } from "react-native-paper";
import { Author } from "../../../types/post";
import WeatherBadge from "../common/WeatherBadge";
import { fetchWeatherByCity } from "../../../services/weatherService";
import api from "../../../api/api";
import { useThemeContext } from "../../../context/ThemeContext"; 


interface AuthorHeaderProps {
  author: Author;
  sharedBy?: Author | null;
  actions?: React.ReactNode;
  weather?: any | null;
  postId?: string;
}

export default function AuthorHeader({
  author,
  sharedBy,
  actions,
  weather,
  postId,
}: AuthorHeaderProps) {
  const {theme} = useThemeContext();
  const [localWeather, setLocalWeather] = useState<any | null>(weather ?? null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (localWeather || !author) return;
      try {
        const city = (author as any).city;
        const country = (author as any).country_iso;
        if (!city) return;
        setLoadingWeather(true);
        const w = await fetchWeatherByCity(city, country);
        if (mounted) setLocalWeather(w);
      } catch (e) {
        console.warn("Failed to fetch weather for author", e);
      } finally {
        if (mounted) setLoadingWeather(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [author]);

  useEffect(() => {
    let mounted = true;
    async function loadFromPost() {
      if (localWeather || !postId) return;
      try {
        const res = await api.get(`/posts/${postId}`);
        const payload = res.data?.data;
        if (payload?.weather && mounted) setLocalWeather(payload.weather);
      } catch {
        // ignore
      }
    }
    loadFromPost();
    return () => {
      mounted = false;
    };
  }, [postId, localWeather]);

  if (!author) return null;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.row}>
        {/* Avatar + info */}
        <View style={styles.left}>
          <Avatar.Image
            size={56}
            source={{
              uri:
                author.profile_picture_url ??
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
          />

          <View style={styles.info}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {author.displayname || author.username}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              @{author.username}
            </Text>

            {sharedBy && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Compartido por{" "}
                <Text style={{ fontWeight: "600", color: theme.colors.onSurface }}>
                  {sharedBy.displayname || sharedBy.username}
                </Text>
              </Text>
            )}
          </View>
        </View>

        {/* Clima o spinner */}
        <View style={styles.right}>
          {loadingWeather ? (
            <ActivityIndicator animating color={theme.colors.primary} size="small" />
          ) : (
            <WeatherBadge weather={localWeather} variant="inline" />
          )}
        </View>

        {/* Acciones */}
        {actions && <View style={styles.actions}>{actions}</View>}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderRadius: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    marginLeft: 12,
    flexShrink: 1,
  },
  right: {
    marginLeft: "auto",
  },
  actions: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
