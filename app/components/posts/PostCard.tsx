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
  const isShared = !!post.shared_post;
 const theme = useThemeContext();
  const [editRequested, setEditRequested] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
const isOwn = Boolean(user && post?.author && String(post.author.id) === String(user.id));

  const description = post.text ?? "(sin descripción)";

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
            try {
              setLoading(true);
              await deletePost(post.id);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReport = async (reason: string) => {
    try {
      setLoading(true);
      await reportPost(post.id, reason);
    } finally {
      setLoading(false);
    }
  };

  return (
  <Card mode="contained" style={styles.card}>
    {isShared ? (
      <SharedPost post={post} />
    ) : (
      <View>
        <WeatherBackground postId={post.id}>
          <View style={styles.headerContainer}>
            {post.author && (
              <AuthorHeader
                author={post.author}
                postId={post.id}
                actions={
                  <PostActions
                    onEdit={() => setEditRequested(true)}
                    onDelete={handleDelete}
                    onReport={handleReport}
                    loading={loading}
                    isOwn={isOwn}
                  />
                }
              />
            )}
          </View>
        </WeatherBackground>

        <View style={styles.bodyContainer}>
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
    width: "90%",
    maxWidth: 500,
    minHeight: 250,
    marginVertical: 12,
    borderRadius: 18,
    overflow: "hidden",

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  headerContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  bodyContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    flex: 1,
  },
});
