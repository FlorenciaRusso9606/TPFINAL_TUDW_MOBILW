import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Drawer, Avatar, Text, Divider, Button,  } from "react-native-paper"; 
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useThemeContext } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthBase";
import {
  Home,
  User,
  MessageSquare,
  Settings,
  PenSquare,
  LayoutDashboard,
  Users,
  Flag,
  LogOut,
} from "lucide-react-native";
import { fetchWeatherByCity } from "../../../services/weatherService";

export default function SidebarDrawer(props: DrawerContentComponentProps) {
  const { user, loading, logout } = useAuth();
  const [weather, setWeather] = React.useState<any | null>(null);
  const {theme} = useThemeContext()
  if (loading) return <h1 className="text-center py-10 text-lg">Cargando...</h1>;


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (user?.city && user?.country_iso) {
          const w = await fetchWeatherByCity(user.city, user.country_iso);
          if (mounted) setWeather(w);
        }
      } catch (e) {
        console.warn('weather fetch failed', e);
      }
    })();
    return () => { mounted = false; };
  }, [user?.city, user?.country_iso]);

      return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>La Red</Text>

      {weather?.current && (
        <View style={styles.weatherBox}>
          <Text style={styles.weatherText}>
            {Math.round(weather.current.temp)}° • {weather.current.weather?.[0]?.description}
          </Text>
        </View>
      )}

      <Divider style={{ marginVertical: 10 }} />

      {user && (
        <>
          <View style={styles.profileRow}>
            <Avatar.Image
              size={50}
              source={
                user.profile_picture_url
                  ? { uri: user.profile_picture_url }
                  : require("assets/avatar-placeholder.png")
              }
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.displayName}>{user.displayname}</Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>
          </View>

          <Button
            onPress={logout}
            mode="outlined"
            textColor={theme.colors.error}
            style={{ marginTop: 20 }}
            icon={({ size, color }) => <LogOut size={size} color={color} />}
          >
            Cerrar sesión
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  weatherBox: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 8,
    alignSelf: "flex-start",
  },
  weatherText: {
    fontSize: 13,
    fontWeight: "600",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  username: {
    fontSize: 13,
    color: "#666",
  },
});