import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Avatar, Text, ActivityIndicator, Card } from "react-native-paper";
import Animated, { FadeInUp, FadeOut, Layout } from "react-native-reanimated";
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
  const { theme } = useThemeContext();
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
      } catch {
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
      } catch {}
    }

    loadFromPost();
    return () => {
      mounted = false;
    };
  }, [postId, localWeather]);

  if (!author) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(260)}
      exiting={FadeOut.duration(160)}
      layout={Layout.springify()}
      style={{
        shadowColor: theme.colors.shadow,
        shadowOpacity: theme.dark ? 0.4 : 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <Pressable
        android_ripple={{
          color: theme.colors.primary + "33",
          radius: 200,
        }}
        style={{ borderRadius: 18 }}
      >
        <Card
          style={{
            borderRadius: 18,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
        >
          <Card.Content style={styles.row}>
            <View style={styles.left}>
              <Avatar.Image
                size={56}
                source={{
                  uri:
                    author.profile_picture_url ??
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                style={{ backgroundColor: theme.colors.accent }}
              />

              <View style={styles.info}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {author.displayname || author.username}
                </Text>

                <Text 
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  @{author.username}
                </Text>

                {sharedBy && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Compartido por{" "}
                    <Text style={{ fontWeight: "600", color: theme.colors.primary }}>
                      {sharedBy.displayname || sharedBy.username}
                    </Text>
                  </Text>
                )}
              </View>
            </View>

            {/* Weather */}
            <View style={styles.right}>
              {loadingWeather ? (
                <ActivityIndicator animating color={theme.colors.primary} size="small" />
              ) : (
                <WeatherBadge weather={localWeather} variant="inline" />
              )}
            </View>

            {/* Actions */}
            {actions && <View style={styles.actions}>{actions}</View>}
          </Card.Content>
        </Card>
      </Pressable>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    marginLeft: 12,
    gap: 2,
  },
  right: {
    marginLeft: "auto",
  },
  actions: {
    position: "absolute",
    top: 6,
    right: 6,
  },
});
