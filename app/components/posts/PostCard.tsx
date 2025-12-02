import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card } from "react-native-paper";
import AuthorHeader from "./AuthorHeader";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import SharedPost from "./SharedPost";
import { Post } from "../../../types/post";
import { useAuth } from "../../../context/AuthBase";
import WeatherBackground from "../common/WeatherBackground";
import { reportPost, deletePost } from "../../../services/postService";
import { useThemeContext } from "context/ThemeContext";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const colors = theme.colors;

  const isOwn = user && post?.author && String(post.author.id) === String(user.id);
  const description = post.text ?? "(sin descripción)";

  const [editRequested, setEditRequested] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que querés eliminar el post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await deletePost(post.id);
            setLoading(false);
          },
        },
      ]
    );
  };

  const handleReport = async (reason: string) => {
    setLoading(true);
    await reportPost(post.id, reason);
    setLoading(false);
  };

  return (
    <Card mode="contained" style={[styles.card, { backgroundColor: colors.surface }]}>
      {post.shared_post ? (
        <SharedPost post={post} />
      ) : (
        <View>
          <WeatherBackground postId={post.id}>
            <View style={[styles.headerContainer, { backgroundColor: colors.surfaceVariant }]}>
              {post.author && (
                <AuthorHeader
                  author={post.author}
                  postId={post.id}
                  actions={
                    <PostActions
                      isOwn={isOwn}
                      loading={loading}
                      onEdit={() => setEditRequested(true)}
                      onDelete={handleDelete}
                      onReport={handleReport}
                    />
                  }
                />
              )}
            </View>
          </WeatherBackground>

          <View style={[styles.bodyContainer, { backgroundColor: colors.surfaceVariant }]}>
            <PostBody
              post={post}
              description={description}
              isOwn={isOwn}
              editRequested={editRequested}
              clearEditRequested={() => setEditRequested(false)}
              user={user}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 14,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  headerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  bodyContainer: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
});
