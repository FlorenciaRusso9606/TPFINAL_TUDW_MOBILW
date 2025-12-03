import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Heart, Share2 } from "lucide-react-native";
import api from "../../api/api";
import { useThemeContext } from "../../context/ThemeContext";
import ModalBase from "./common/Modal";
import { Avatar } from "react-native-paper";

interface PostReactionProps {
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

interface UserLike {
  id: string;
  username: string;
  displayname: string;
  profile_picture_url?: string;
}

export const Reaction: React.FC<PostReactionProps> = ({ targetId, type }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [users, setUsers] = useState<UserLike[]>([]);
  const { theme } = useThemeContext();

  // --- LIKE ---
  const toggleReaction = async () => {
    try {
      const endpoint =
        type === "post"
          ? `/reactions/post/${targetId}`
          : `/reactions/comment/${targetId}`;

      const result = await api.post<ToggleReactionResponse>(endpoint, {}, { withCredentials: true });

      setLiked(result.data.liked);
      fetchCount();
    } catch (error: any) {
      Alert.alert(error.response?.data?.message || "Error al dar like");
    }
  };

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

  // --- SHARES ---
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

  // --- USERS WHO LIKED ---
  const fetchUsersLiked = async () => {
    try {
      const endpoint =
        type === "post"
          ? `/reactions/post/${targetId}/users`
          : `/reactions/comment/${targetId}/users`;

      const result = await api.get<{ users: UserLike[] }>(endpoint);
      setUsers(result.data.users);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUserLiked();
    fetchCount();
    if (type === "post") fetchUserShared();
  }, []);

  return (
    <View style={styles.container}>

      {/* --- CANTIDAD DE LIKES --- */}
      {count > 0 && (
        <TouchableOpacity
          onPress={() => {
            fetchUsersLiked();
            setShowLikes(true);
          }}
          style={styles.likeWrapper}
        >
          <Text style={[styles.likeCount, { color: theme.colors.text }]}>
            {count}
          </Text>
        </TouchableOpacity>
      )}

      {/* ❤️ LIKE BUTTON */}
      <TouchableOpacity style={styles.reactionButton} onPress={toggleReaction}>
        <Heart
          color={liked ? "red" : theme.colors.textSecondary}
          fill={liked ? "red" : "none"}
          size={22}
        />
      </TouchableOpacity>

      {/* 🔁 SHARE */}
      {type === "post" && (
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={handleShare}
          disabled={loading || shared}
        >
          {loading ? (
            <ActivityIndicator size="small" />
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
      )}

      {/* MODAL DE USUARIOS QUE DIERON LIKE */}
      <ModalBase
        title="Likes del post"
        open={showLikes}
        onClose={() => setShowLikes(false)}
        cancelText="Cerrar"
      >
        <View style={{ gap: 12 }}>
          {users.map((u) => (
            <TouchableOpacity key={u.id} style={styles.userRow}>
              <Avatar.Image
                size={48}
                source={
                  u.profile_picture_url
                    ? { uri: u.profile_picture_url }
                    : require("../../assets/default-avatar-icon.jpg")
                }
              />
              <View>
                <Text style={styles.username}>{u.username}</Text>
                <Text style={styles.displayname}>{u.displayname}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ModalBase>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  likeWrapper: {
    padding: 4,
  },
  likeCount: {
    fontSize: 14,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shareText: {
    fontSize: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
  },
  displayname: {
    color: "#666",
  },
});
