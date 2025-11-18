import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Card, useTheme } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";

import AuthorHeader from "../../components/posts/AuthorHeader";
import PostBody from "../../components/posts/PostBody";
import PostActions from "../../components/posts/PostActions";
import Comments from "../../components/Comments/Comments";

import api from "..//../../api/api"; // AJUSTAR ruta si es necesario
import { useAuth } from "..//../../context/AuthBase"; // AJUSTAR ruta si es necesario
import { Post } from "../../../types/post"; // AJUSTAR ruta si es necesario
import { deletePost, reportPost } from "services/postService";
export default function PostDetail() {
  const theme = useTheme();
  const { id } = useLocalSearchParams(); // reemplazo de useParams de Next.js

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get<{ data: Post }>(`/posts/${id}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // Loading
  if (loading || !post || !post.author) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isOwn = Boolean(user && String(post.author.id) === String(user.id));

  // DELETE POST
  const handleDelete = async () => {
    // React Native NO usa confirm(), lo reemplazás con Alert
    // Pero si querés lo dejo así, lo ajustamos después
    try {
      await deletePost(post.id);
      router.replace("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  // REPORT POST
  const handleReport = async (reason: string) => {
    try {
       await reportPost(post.id, reason);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <AuthorHeader
            author={post.author}
            actions={
              <PostActions
                onEdit={() => {}}
                onDelete={handleDelete}
                onReport={handleReport}
                loading={false}
                isOwn={isOwn}
              />
            }
            postId={post.id}
          />

          <PostBody post={post} description={post.text ?? ""} />

          <Comments postId={post.id} author_id={post.author.id} author_username={post.author.username}/>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
