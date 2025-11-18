import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Heart, Share2 } from "lucide-react-native";
import api from "../../api/api";
import { useThemeContext } from "../../context/ThemeContext";
import Button from "./Button";

interface PostReactionProps {
  userId?: string;
  targetId: string;
  type: "post" | "comment";
}

interface ToggleReactionResponse {
  liked: boolean;
}

interface LikesCountResponse {
  likes: number;
}

interface ShareStatusResponse {
  shared: boolean;
}

export const Reaction: React.FC<PostReactionProps> = ({ targetId, type }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  // Toggle Like
  const toggleReaction = async () => {
    try {
      const endpoint =
        type === "post"
          ? `/reactions/post/${targetId}`
          : `/reactions/comment/${targetId}`;

      const result = await api.post<ToggleReactionResponse>(
        endpoint,
        {},
        { withCredentials: true }
      );

      setLiked(result.data.liked);
      fetchCount();
    } catch (error: any) {
      Alert.alert(error.response?.data?.message || "Error al dar like");
    }
  };

  // Obtener cantidad de likes
  const fetchCount = async () => {
    try {
      const endpoint =
        type === "post"
          ? `/reactions/post/${targetId}/likes`
          : `/reactions/comment/${targetId}/likes`;

      const result = await api.get<LikesCountResponse>(endpoint);
      setCount(result.data.likes);
    } catch {
      Alert.alert("Error al obtener los likes");
    }
  };

  // Saber si el usuario ya dio like
  const fetchUserLiked = async () => {
    try {
      const endpoint =
        type === "post"
          ? `/reactions/post/${targetId}/isLiked`
          : `/reactions/comment/${targetId}/isLiked`;

      const result = await api.get<ToggleReactionResponse>(endpoint, {
        withCredentials: true,
      });

      setLiked(result.data.liked);
    } catch {
      setLiked(false);
    }
  };

  // Saber si el usuario ya compartió el post
  const fetchUserShared = async () => {
    try {
      const result = await api.get<ShareStatusResponse>(
        `/posts/${targetId}/isShared`,
        { withCredentials: true }
      );
      setShared(result.data.shared);
    } catch {
      setShared(false);
    }
  };

  // Compartir post
  const handleShare = async () => {
    try {
      setLoading(true);
      await api.post(`/posts/${targetId}/share`, {}, { withCredentials: true });
      Alert.alert("Post compartido correctamente");
      setShared(true);
    } catch (error: any) {
      Alert.alert(error.response?.data?.message || "Error al compartir el post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLiked();
    fetchCount();
    if (type === "post") fetchUserShared();
  }, []);

  return (
    <View style={styles.container}>
      {/* ❤️ Botón de like */}
      <TouchableOpacity style={styles.reactionButton} onPress={toggleReaction}>
        <Heart
          color={liked ? "red" : theme.colors.textSecondary}
          fill={liked ? "red" : "none"}
          size={22}
        />
        {count > 0 && <Text style={styles.likeCount}>{count}</Text>}
      </TouchableOpacity>

      {/* 🔁 Botón de compartir */}
      <TouchableOpacity
        style={styles.reactionButton}
        onPress={handleShare}
        disabled={loading || shared}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Share2
            color={shared ? theme.colors.primary : theme.colors.textSecondary}
            fill={shared ? theme.colors.primary : "none"}
            size={22}
          />
        )}
        <Text
          style={[
            styles.shareText,
            { color: shared ? theme.colors.primary : theme.colors.textSecondary },
          ]}
        >
          {shared ? "Compartido" : "Compartir"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likeCount: {
    fontSize: 14,
  },
  shareText: {
    fontSize: 14,
  },
});
