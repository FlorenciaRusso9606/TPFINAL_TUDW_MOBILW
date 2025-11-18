import { StyleSheet } from "react-native";
import { Card, Text  } from "react-native-paper";
import { usePosts } from "../../../hooks/usePosts";
import PostCard from "./PostCard";
import { useThemeContext } from "../../../context/ThemeContext";
interface PostListProps {
  initialMode: string
}

export default function PostList({ initialMode }: PostListProps) {
  const {theme} = useThemeContext();
  const { posts, error, loading } = usePosts(initialMode);
  if (loading) return <Text>Cargando posts...</Text>;
  if (error) return <Text style={{color: theme.colors.error}}>{error}</Text>;
  if (posts.length === 0) return <Text>No hay posts todavía</Text>;

  return (
   <Card style={styles.container} contentStyle={styles.content} mode="outlined">
  {posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))}
</Card>

  );
}
const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  content: {
    padding: 12,
    gap: 16,     
  },
});
