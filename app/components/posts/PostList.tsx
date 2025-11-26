import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { usePosts } from "../../../hooks/usePosts";
import PostCard from "./PostCard";
import { useThemeContext } from "../../../context/ThemeContext";

interface PostListProps {
  initialMode: string;
  username?: string;
}

export default function PostList({ initialMode, username }: PostListProps) {
  const { theme } = useThemeContext();
  const { posts, error, loading } = usePosts(initialMode, username);

  if (loading) {
    return (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.skeleton,
              { backgroundColor: theme.dark ? "#2a2a2a" : "#e6e6e6" },
            ]}
          />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredState}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.error,
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          Error cargando los posts
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onBackground, opacity: 0.7 }}
        >
          {error}
        </Text>
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.centeredState}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.text,
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          No hay posts todavía
        </Text>

        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.textSecondary, opacity: 0.7 }}
        >
          Cuando se publiquen, aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postWrapper}>
          <PostCard post={post} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingHorizontal: 12,
    gap: 18,
    marginTop: 12,
  },

  skeleton: {
    height: 160,
    borderRadius: 16,
    opacity: 0.45,
  },

  centeredState: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 60,
    opacity: 0.85,
    paddingHorizontal: 20,
  },

  listContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingBottom: 16,
    gap: 16,
  },

  postWrapper: {
    width: "100%",
  },
});
