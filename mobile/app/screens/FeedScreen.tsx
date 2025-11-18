import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button, ToggleButton as ToggleGroup } from "react-native-paper";

import PostList from "../components/posts/PostList";
import ToggleButton from "../components/ToggleButton";
import CrearPost from "../components/CrearPost";

export default function FeedScreen() {
  const [initialMode, setInitialMode] = useState<"all" | "following">("all");
  const [hydrated, setHydrated] = useState(false);

  // Cargar modo guardado
  useEffect(() => {
    async function loadMode() {
      try {
        const saved = await AsyncStorage.getItem("feedMode");
        if (saved === "all" || saved === "following") {
          setInitialMode(saved);
        } else {
          setInitialMode("all");
          await AsyncStorage.setItem("feedMode", "all");
        }
      } catch {
        setInitialMode("all");
      } finally {
        setHydrated(true);
      }
    }
    loadMode();
  }, []);

  // Guardar cambios
  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem("feedMode", initialMode);
    }
  }, [initialMode, hydrated]);

  if (!hydrated) return null;

  return (
    <View style={styles.container}>
      {/* Toggle de tema */}
      <View style={styles.topRight}>
        <ToggleButton />
      </View>

      <Text variant="headlineMedium" style={styles.title}>
        Mi Feed
      </Text>

      <View style={styles.content}>
        {/* Selector de feed */}
        <View style={styles.toggleContainer}>
          <View style={styles.buttonGroup}>
            <Button
              mode={initialMode === "all" ? "contained" : "outlined"}
              onPress={() => setInitialMode("all")}
            >
              Todos
            </Button>

            <Button
              mode={initialMode === "following" ? "contained" : "outlined"}
              onPress={() => setInitialMode("following")}
            >
              Seguidos
            </Button>
          </View>

          <CrearPost />
        </View>

        {/* Lista de posts */}
        <PostList initialMode={initialMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  topRight: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    width: "100%",
    maxWidth: 800,
    gap: 24,
  },
  toggleContainer: {
    width: "100%",
    gap: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
