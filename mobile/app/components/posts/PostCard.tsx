import React from "react";
import { View, StyleSheet, Alert  } from "react-native";
import { Card } from "react-native-paper";
import AuthorHeader from "./AuthorHeader";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import SharedPost from "./SharedPost";
import { Post } from "../../../types/post";
import { useAuth } from "../../../context/AuthBase";
import WeatherBackground from "../common/WeatherBackground";
import { useThemeContext } from "../../../context/ThemeContext";
import { reportPost } from "../../../services/postService";
import { deletePost } from "../../../services/postService";
export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const description = post.text ?? "(sin descripción)";
  const created = post.created_at ?? "";

  const isShared = !!post.shared_post;
  const [editRequested, setEditRequested] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isOwn = Boolean(user && String(post.author.id) === String(user.id));

  const handleDelete = async () => {
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
          try {
             await deletePost(post.id);
              // Acá podrías emitir un evento o refrescar la lista manualmente
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
   ) 
  };

  const handleReport = async (reason: string) => {
    setLoading(true);
    try {
    await reportPost(post.id, reason); 
     // optional: show toast
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = () => setEditRequested(true);

  return (
    <Card style={styles.container}
      mode="outlined" >
        {/* Si es un post compartido → mostrar SharedPost */}
        <Card style={styles.innerCard}>
        {isShared ? (
          <SharedPost post={post} />
        ) : (
          <>
           <WeatherBackground weather={(post as any).weather} postId={post.id}  imageOpacity={0.50}>
            <AuthorHeader
              author={post.author}
              actions={
                <PostActions
                  onEdit={handleEditRequest}
                  onDelete={handleDelete}
                  onReport={handleReport}
                  loading={loading}
                  isOwn={isOwn}
                />
              }
              postId={post.id}
            />
            </WeatherBackground>
              <View style={styles.body}>
              <PostBody
                post={post}
                description={description}
                isOwn={isOwn}
                onDelete={handleDelete}
                onReport={handleReport}
                editRequested={editRequested}
                clearEditRequested={() => setEditRequested(false)}
                user={user}
              />
            </View>
          </>
        )}
      </Card>
       </Card>
  );
}
const styles = StyleSheet.create({
  container: {
   maxWidth: 800,
   alignSelf: "center",
   margin: "auto",
    borderRadius: 8,
     backgroundColor: "#fff",
      shadowColor: "#000",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    boxShadow: "1px solid black",
     shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  innerCard: {
    padding: 8,
  },
  body: {
    paddingHorizontal: 8,
  },
});
