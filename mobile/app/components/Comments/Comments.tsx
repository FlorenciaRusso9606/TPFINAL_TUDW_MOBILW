import  { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, ActivityIndicator, Divider } from "react-native-paper";
import { Comment } from "../../../types/comment";
import socket from "../../../services/socket";
import CommentForm from "./CommentForm";
import {CommentItem} from "./CommentItem";
import { CommentFormData } from "../../../schemas/commentSchema";
import api from "../../../api/api";
import toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthBase";
import { useThemeContext } from "../../../context/ThemeContext";

interface CommentProps {
  postId: string | number;
  author_id?: string;       
  author_username?: string;
}

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const authorId = user?.id;
  const {theme} = useThemeContext();

  // Fetch inicial
  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Comment[]>(`/comments/post/${postId}`);
      setComments(data);
    } catch (error) {
      toast.show({
        type: "error",
        text1: "Error al cargar comentarios",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helpers para manipular árbol
  const addCommentToTree = (tree: Comment[], newComment: Comment): Comment[] => {
    if (!newComment.parent_id) {
      return [...tree, { ...newComment, children: [] }];
    }

    const addRecursively = (nodes: Comment[]): Comment[] =>
      nodes.map((node) => {
        if (node.id === newComment.parent_id) {
          return {
            ...node,
            children: [...(node.children || []), { ...newComment, children: [] }],
          };
        }
        if ((node.children?.length || 0) > 0) {
          return { ...node, children: addRecursively(node.children || []) };
        }
        return node;
      });

    return addRecursively(tree);
  };

  const updateCommentInTree = (tree: Comment[], updatedComment: Comment): Comment[] => {
    const updateRecursively = (nodes: Comment[]): Comment[] =>
      nodes.map((node) => {
        if (node.id === updatedComment.id) {
          return { ...node, text: updatedComment.text };
        }
        if ((node.children?.length || 0) > 0) {
          return { ...node, children: updateRecursively(node.children || []) };
        }
        return node;
      });

    return updateRecursively(tree);
  };

  const deleteCommentFromTree = (tree: Comment[], commentId: string | number): Comment[] => {
    const deleteRecursively = (nodes: Comment[]): Comment[] =>
      nodes
        .filter((node) => node.id !== commentId)
        .map((node) => ({
          ...node,
          children: deleteRecursively(node.children || []),
        }));

    return deleteRecursively(tree);
  };

  // Socket IO
  useEffect(() => {
    fetchComments();

    const newEvent = `new-comment-${postId}`;
    const updateEvent = `update-comment-${postId}`;
    const deleteEvent = `delete-comment-${postId}`;

    const handleNewComment = (newComment: Comment) => {
      setComments((prev) => addCommentToTree(prev, newComment));
    };

    const handleUpdateComment = (updated: Comment) => {
      setComments((prev) => updateCommentInTree(prev, updated));
    };

    const handleDeleteComment = (deletedId: string | number) => {
      setComments((prev) => deleteCommentFromTree(prev, deletedId));
    };

    socket.on(newEvent, handleNewComment);
    socket.on(updateEvent, handleUpdateComment);
    socket.on(deleteEvent, handleDeleteComment);

    return () => {
      socket.off(newEvent, handleNewComment);
      socket.off(updateEvent, handleUpdateComment);
      socket.off(deleteEvent, handleDeleteComment);
    };
  }, [postId]);

  // Crear comentario
  const handleSubmit = async (data: CommentFormData, parentId?: string | number | null) => {
    try {
      const res = await api.post(
        "/comments",
        {
          author_id: authorId,
          post_id: postId,
          text: data.text,
          parent_id: parentId || null,
        },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      toast.show({
        type: "error",
        text1: "Error al publicar comentario",
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text
        variant="titleMedium"
        style={{
          fontWeight: "600",
          marginBottom: 12,
          color: theme.colors.onBackground,
        }}
      >
        Comentarios
      </Text>

      <Card mode="contained" style={styles.formCard}>
        <CommentForm postId={postId} onSubmit={handleSubmit} />
      </Card>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator animating color={theme.colors.primary} />
        </View>
      ) : comments.length === 0 ? (
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 10 }}>
          No hay comentarios todavía. ¡Sé el primero en comentar!
        </Text>
      ) : (
        <View>
          {comments.map((c, index) => (
            <View key={c.id}>
              <CommentItem
                comment={c}
                onReply={handleSubmit}
                onEdit={(updated) => setComments((prev) => updateCommentInTree(prev, updated))}
                onDelete={(id) => setComments((prev) => deleteCommentFromTree(prev, id))}
              />
              {index !== comments.length - 1 && <Divider style={{ opacity: 0.4, marginVertical: 8 }} />}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  formCard: {
    padding: 12,
    marginBottom: 12,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});
