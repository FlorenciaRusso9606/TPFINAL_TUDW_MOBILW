import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import ToggleButton from "../components/ToggleButton";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "../components/posts/PostCard";
import { useThemeContext } from "../../context/ThemeContext";

export default function FeedScreen() {
  const [mode, setMode] = useState<"all" | "following">("all");
  const [hydrated, setHydrated] = useState(false);

  const { theme } = useThemeContext();

  const { posts, loading } = usePosts(mode);

  useEffect(() => {
    async function loadMode() {
      const saved = await AsyncStorage.getItem("feedMode");
      if (saved === "all" || saved === "following") setMode(saved);
      setHydrated(true);
    }
    loadMode();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem("feedMode", mode);
  }, [mode, hydrated]);

  if (!hydrated) return null;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 48,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={styles.topRight}>
        <ToggleButton />
      </View>

      <Text
        variant="headlineMedium"
        style={[
          styles.title,
          { color: theme.colors.text }
        ]}
      >
        Mi Feed
      </Text>

      {/* TABS */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setMode("all")} style={styles.tabButton}>
            <Text
              style={[
                styles.tabText,
                { color: theme.colors.textSecondary },
                mode === "all" && { color: theme.colors.primary }
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode("following")} style={styles.tabButton}>
            <Text
              style={[
                styles.tabText,
                { color: theme.colors.textSecondary },
                mode === "following" && { color: theme.colors.primary }
              ]}
            >
              Seguidos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Línea inferior */}
        <View
          style={[
            styles.bottomLine,
            { backgroundColor: theme.colors.border }
          ]}
        />

        {/* Indicador */}
        <View
          style={[
            styles.indicator,
            { backgroundColor: theme.colors.primary },
            mode === "all" ? styles.indicatorLeft : styles.indicatorRight,
          ]}
        />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.textSecondary }}>
            No hay posts todavía
          </Text>
        }
        ListFooterComponent={
          loading ? (
            <Text style={{ color: theme.colors.textSecondary }}>
              Cargando...
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topRight: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },

  title: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },

  tabsWrapper: {
    marginBottom: 16,
    position: "relative",
  },

  tabsRow: {
    flexDirection: "row",
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },

  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },

  bottomLine: {
    width: "100%",
    height: 2,
    marginTop: 4,
  },

  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "50%",
    borderRadius: 2,
  },

  indicatorLeft: { left: 0 },
  indicatorRight: { right: 0 },
});
