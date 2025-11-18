import { useState, useEffect, useMemo } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  IconButton,
  ActivityIndicator,
  Button,
  Divider,
} from "react-native-paper";
import { Save, X, Languages, Share2 } from "lucide-react-native";
import { Media } from "../../../types/post";
import { Reaction } from "../Reaction";
import { updatePost } from "../../../services/postService";
import useTranslation from "../../../hooks/useTranslation";
import { useThemeContext } from "../../../context/ThemeContext";
import { LucideProps } from "lucide-react-native";
interface PostBodyProps {
  post: any;
  description: string;
  isOwn?: boolean;
  onDelete?: () => void;
  onReport?: (reason: string) => void;
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
  const {theme} = useThemeContext();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(description);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success" | null; text?: string } | null>(null);

  const { translated, sourceLang, loading: tlLoading, translate, clear } = useTranslation();
  const postId = post.id.toString();

  const browserLang = "es"; // en mobile no hay navigator.language
  const showTranslateButton = useMemo(() => {
    if (translated) return false;
    if (sourceLang && sourceLang.toUpperCase() === browserLang.toUpperCase()) return false;
    return true;
  }, [translated, sourceLang]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePost(post.id, { text });
      setEditing(false);
      setMsg({ type: "success", text: "Post actualizado correctamente" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.error?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editRequested) {
      setEditing(true);
      clearEditRequested?.();
    }
  }, [editRequested]);

  const medias = post.medias ?? [];

  const renderMediaItem = (media: Media, idx: number) => {
    const url = media?.url;
    if (!url) return null;

    const isVideo = media.type === "VIDEO";
    const isAudio = media.type === "AUDIO";

    // Para simplificar, en mobile podrías usar expo-av para video/audio
    if (isVideo) return null;
    if (isAudio) return null;

    return (
      <Card key={idx} style={styles.mediaCard}>
        <Card.Cover source={{ uri: url }} resizeMode="contain" />
      </Card>
    );
  };

  const handleTranslateClick = async () => {
    await translate({ text: description, postId });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Compartido */}
      {post.shared_post && (
        <Card style={styles.sharedCard}>
          <View style={styles.sharedHeader}>
            <Share2 color={theme.colors.primary} size={18} />
            <Text variant="bodyMedium" style={styles.sharedText}>
              Compartido de{" "}
              <Text style={{ fontWeight: "bold" }}>
                {post.shared_post.author?.username || "usuario desconocido"}
              </Text>
            </Text>
          </View>
          <Text style={styles.sharedBody}>{post.shared_post.text}</Text>
        </Card>
      )}

      {/* Texto del post */}
      <Text style={styles.postText}>{translated ?? text}</Text>

      {/* Medios */}
      {medias.length > 0 && (
        <View style={styles.mediaGrid}>{medias.map((m: Media, i: number) => renderMediaItem(m, i))}</View>
      )}

      <Divider style={{ marginVertical: 10 }} />

      {/* Botones de acción */}
      <View style={styles.actions}>
        <Reaction userId={user?.id} type="post" targetId={post.id} />

        {showTranslateButton && (
          <IconButton
            icon={() =>
              tlLoading ? (
                <ActivityIndicator size={18} />
              ) : (
                <Languages color={theme.colors.primary} {...({} as LucideProps)} />
              )
            }
            onPress={handleTranslateClick}
          />
        )}

        {translated && (
          <>
            <IconButton icon={() => <Languages />} />
            <Button
              mode="outlined"
              onPress={() => clear()}
              style={{ height: 32 }}
              labelStyle={{ textTransform: "none", fontSize: 12 }}
            >
              Ver original
            </Button>
          </>
        )}
      </View>

      {/* Mensajes */}
      {msg && (
        <Text
          style={{
            color: msg.type === "error" ? theme.colors.error : theme.colors.primary,
            marginTop: 8,
          }}
        >
          {msg.text}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 8,
  },
  sharedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
    marginVertical: 10,
    padding: 10,
  },
  sharedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sharedText: {
    marginLeft: 6,
    flexShrink: 1,
  },
  sharedBody: {
    fontStyle: "italic",
    opacity: 0.8,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 8,
  },
  mediaGrid: {
    gap: 8,
  },
  mediaCard: {
    borderRadius: 10,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
});
