import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  Text,
  Card,
  IconButton,
  ActivityIndicator,
  Button,
  Divider,
} from "react-native-paper";
import { Languages, Share2, MessageCircle } from "lucide-react-native";
import { Media } from "../../../types/post";
import { Reaction } from "../Reaction";
import { updatePost } from "../../../services/postService";
import useTranslation from "../../../hooks/useTranslation";
import { useThemeContext } from "../../../context/ThemeContext";
import api from "../../../api/api";
import { useNavigation } from "@react-navigation/native";

interface PostBodyProps {
  post: any;
  description: string;
  isOwn?: boolean;
  editRequested?: boolean;
  clearEditRequested?: () => void;
  user?: any;
}

export default function PostBody({
  post,
  description,
  isOwn = false,
  editRequested,
  clearEditRequested,
  user,
}: PostBodyProps) {
  const { theme } = useThemeContext();
  const navigation: any = useNavigation();

  const [commentCounter, setCommentCounter] = useState<number>(0);
  const [msg, setMsg] = useState<{ type: "error" | "success" | null; text?: string } | null>(null);

  const { translated, sourceLang, loading: tlLoading, translate, clear } = useTranslation();
  const postId = post.id.toString();

  /** BUTTON: Show translation button only when language differs */
  const showTranslateButton = useMemo(() => {
    if (translated) return false;
    if (sourceLang?.toUpperCase() === "ES") return false;
    return true;
  }, [translated, sourceLang]);

  /** COMMENTS COUNTER */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/comments/post/${postId}`);
        setCommentCounter(res.data.length);
      } catch {}
    };
    load();
  }, []);

  /** Enable editing mode if requested by parent */
  useEffect(() => {
    if (editRequested) {
      clearEditRequested?.();
    }
  }, [editRequested]);

  /** Translate handler */
  const handleTranslateClick = () =>
    translate({ text: description, postId });

  const medias: Media[] = post.medias ?? [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>

      {post.shared_post && (
        <Card
          style={[
            styles.sharedCard,
            { borderLeftColor: theme.colors.primary }
          ]}
        >
          <View style={styles.sharedHeader}>
            <Share2 size={16} color={theme.colors.primary} />
            <Text style={[styles.sharedText, { color: theme.colors.onSurface }]}>
              Compartido de{" "}
              <Text style={{ fontWeight: "700", color: theme.colors.primary }}>
                {post.shared_post.author?.username || "usuario"}
              </Text>
            </Text>
          </View>

          <Text style={[styles.sharedBody, { color: theme.colors.onSurfaceVariant }]}>
            {post.shared_post.text}
          </Text>
        </Card>
      )}

      <Text style={[styles.postText, { color: theme.colors.onSurface }]}>
        {translated ?? description}
      </Text>

      {medias.length > 0 && (
        <View style={styles.gallery}>
          {medias.map((media, idx) => (
            <Image
              key={idx}
              source={{ uri: media.url }}
              style={[
                styles.mediaItem,
                {
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            />
          ))}
        </View>
      )}

      <Divider
        style={{
          backgroundColor: theme.colors.outlineVariant,
        }}
      />

      <View style={styles.actionsRow}>
        <Reaction userId={user?.id} type="post" targetId={post.id} />

        {showTranslateButton && (
          <IconButton
            icon={() =>
              tlLoading ? (
                <ActivityIndicator size={18} />
              ) : (
                <Languages size={20} color={theme.colors.primary} />
              )
            }
            onPress={handleTranslateClick}
          />
        )}

        {translated && (
          <Button
            mode="outlined"
            onPress={clear}
            style={styles.originalButton}
            textColor={theme.colors.primary}
          >
            Ver original
          </Button>
        )}

        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => navigation.navigate("PostDetail", { postId })}
        >
          <MessageCircle size={20} color={theme.colors.onSurfaceVariant} />
          <Text style={{ color: theme.colors.onSurfaceVariant }}>{commentCounter}</Text>
        </TouchableOpacity>
      </View>
      {msg && (
        <Text
          style={{
            marginTop: 6,
            color: msg.type === "error" ? theme.colors.error : theme.colors.primary,
            fontSize: 13,
          }}
        >
          {msg.text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },

  sharedCard: {
    borderLeftWidth: 4,
    padding: 10,
  },

  sharedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  sharedText: {
    fontSize: 14,
    flexShrink: 1,
  },

  sharedBody: {
    fontSize: 14,
    opacity: 0.8,
  },

  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },

  gallery: {
    flexDirection: "column",
    gap: 8,
  },

  mediaItem: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 16,
    borderWidth: 1,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  originalButton: {
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
  },

  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
});
