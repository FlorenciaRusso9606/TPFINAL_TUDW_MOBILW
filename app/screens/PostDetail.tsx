"use client";

import { useEffect, useState } from "react";
import api from "../../api/api";
import { View , StyleSheet} from "react-native";
import { Card, ActivityIndicator  } from "react-native-paper";
import Comments from "../components/Comments/Comments";
import AuthorHeader from "../components/posts/AuthorHeader";
import PostBody from "../components/posts/PostBody";
import PostActions from "app/components/posts/PostActions";
import { useAuth } from "context/AuthBase";
import { Post } from "../../types/post";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deletePost, reportPost } from "services/postService";
const PostDetail = () => {
    const route = useRoute()
  const { postId } = route.params as { postId: string };
  const navigation = useNavigation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

 useEffect(() => {

  const fetchPost = async () => {

    try {
      const response = await api.get<{ data: Post }>(`/posts/${postId}`);


      setPost(response.data.data);
    } catch (error: any) {
  
    } finally {
      setLoading(false);
    }
  };

  if (postId) {
    fetchPost();
  } else {
    setLoading(false);
  }
}, [postId]);


  if (loading || !post || !post.author) {
    return (
      <View style={styles.loadingContainer} >
        <ActivityIndicator  />
      </View>
    );
  }

  const isOwn = Boolean(user && String(post.author.id) === String(user.id));

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      navigation.navigate("FeedScreen" as never)
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (reason: string) => {
    try {
      await reportPost(post.id, reason);
    } catch (err) {
      console.error(err);
    }
  };
  return (
      <View style={styles.container}>
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
        <Comments postId={post.id} author_id={post.author.id} />
      </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})