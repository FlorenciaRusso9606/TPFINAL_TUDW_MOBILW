import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { usePosts } from "../../../hooks/usePosts";
import PostCard from "./PostCard";
import { useThemeContext } from "../../../context/ThemeContext";

interface PostListProps {
  initialMode: string;
  username?: string;
}

export default function PostList({ initialMode, username  }: PostListProps) {
  const { theme } = useThemeContext();
  const { posts, error, loading } = usePosts(initialMode, username);

  if (loading) return <Text>Cargando posts...</Text>;
  if (error) return <Text style={{ color: theme.colors.error }}>{error}</Text>;
  if (posts.length === 0) return <Text style={{ color: theme.colors.primary }}>No hay posts todavía</Text>;

  return (
    <View style={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
  width: "100%",
  gap: 16,
  paddingHorizontal: 8,
  paddingBottom: 16,
  flexGrow: 1,
}

});
