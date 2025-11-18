import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Avatar, TextInput, Button, IconButton } from "react-native-paper";
import { MessageCircle, Edit2, Trash2 } from "lucide-react-native";
import { useAuth } from "../../../context/AuthBase";
import { Comment } from "../../../types/comment";
import { CommentFormData } from "../../../schemas/commentSchema";
import { Reaction } from "../Reaction";
import CommentForm from "./CommentForm";
import api from "../../../api/api";
import toast from "react-native-toast-message";
import { useThemeContext } from "../../../context/ThemeContext";
import { LucideProps } from "lucide-react-native";
interface CommentItemProps {
  comment: Comment;
  onReply: (data: CommentFormData, parentId?: string | number | null) => void;
  onEdit?: (updated: Comment) => void;
  onDelete?: (commentId: string | number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
}) => {
  const {theme} = useThemeContext();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "ahora";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return date.toLocaleDateString();
  };

  const handleEditSubmit = async () => {
    try {
      if (!editedText.trim()) {
        toast.show({ type: "error", text1: "El comentario no puede estar vacío" });
        return;
      }

      const { data: updated } = await api.put(`/comments/${comment.id}`, {
        text: editedText,
      });
      onEdit?.(updated);
      setIsEditing(false);
      toast.show({ type: "success", text1: "Comentario actualizado ✏️" });
    } catch (error) {
      toast.show({ type: "error", text1: "Error al editar el comentario" });
    }
  };

  const handleDelete = async () => {
    // @ts-ignore confirm no existe en RN, podés usar un modal personalizado
    if (!confirm("¿Seguro que querés eliminar este comentario?")) return;
    try {
      await api.delete(`/comments/${comment.id}`, { withCredentials: true });
      onDelete?.(comment.id);
      toast.show({ type: "success", text1: "Comentario eliminado 🗑️" });
    } catch {
      toast.show({ type: "error", text1: "Error al eliminar el comentario" });
    }
  };

  const handleReply = async (data: CommentFormData) => {
    await onReply(data, comment.id);
    setShowReply(false);
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Card style={[styles.card, { borderColor: theme.colors.outline }]}>
        <View style={styles.header}>
          <Avatar.Image
            size={30}
            source={{
              uri: comment.author_avatar || "../../default-avatar-icon.jpg",
            }}
          />
          <View style={styles.headerText}>
            <Text variant="titleSmall">{comment.author_username || "Usuario"}</Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatDate(comment.created_at)}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View style={{ marginTop: 8 }}>
            <TextInput
              mode="outlined"
              value={editedText}
              onChangeText={setEditedText}
              multiline
              dense
            />
            <View style={styles.actions}>
              <Button mode="contained" onPress={handleEditSubmit}>
                Guardar
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsEditing(false);
                  setEditedText(comment.text);
                }}
              >
                Cancelar
              </Button>
            </View>
          </View>
        ) : (
          <Text style={styles.text}>{comment.text}</Text>
        )}

        <View style={styles.icons}>
          <Reaction userId={comment.author_id} targetId={comment.id} type="comment" />

          <IconButton
            icon={() => <MessageCircle size={16} color={theme.colors.onSurfaceVariant} {...({} as LucideProps)} />}
            size={16}
            onPress={() => setShowReply((prev) => !prev)}
          />

          {user?.id === comment.author_id && (
            <>
              <IconButton
                icon={() => <Edit2 size={16} color={theme.colors.primary} {...({} as LucideProps)} />}
                size={16}
                onPress={() => setIsEditing(true)}
              />
              <IconButton
                icon={() => <Trash2 size={16} color={theme.colors.error} {...({} as LucideProps)} />}
                size={16}
                onPress={handleDelete}
              />
            </>
          )}
        </View>

        {showReply && (
          <View style={{ marginTop: 8 }}>
            <CommentForm postId={comment.post_id} parentId={comment.id} onSubmit={handleReply} />
          </View>
        )}
      </Card>

      {comment.children?.length ? (
        <View style={[styles.replies, { borderLeftColor: theme.colors.outline }]}>
          <Button
            compact
            textColor={theme.colors.onSurfaceVariant}
            onPress={() => setShowReplies((prev) => !prev)}
          >
            {showReplies
              ? "Ocultar respuestas"
              : `Ver respuestas (${comment.children.length})`}
          </Button>

          {showReplies &&
            comment.children.map((child) => (
              <CommentItem key={child.id} comment={child} onReply={onReply} />
            ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    flexDirection: "column",
  },
  text: {
    marginTop: 6,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  replies: {
    marginTop: 8,
    marginLeft: 16,
    paddingLeft: 8,
    borderLeftWidth: 2,
  },
});
