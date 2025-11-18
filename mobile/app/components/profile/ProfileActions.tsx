import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, ActivityIndicator, useTheme, Icon } from "react-native-paper";
import api from "../../../api/api";
import { User, BlockStatus, FollowStatus } from "../../../types/user";

interface Props {
  profile: User;
  blockStatus: BlockStatus;
  setBlockStatus: (status: BlockStatus) => void;
  followStatus: FollowStatus;
  setFollowStatus: (status: FollowStatus) => void;
}

export default function ProfileActions({
  profile,
  blockStatus,
  setBlockStatus,
  followStatus,
  setFollowStatus,
}: Props) {
  const theme = useTheme();
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const handleBlockToggle = async () => {
    setLoadingBlock(true);
    try {
      if (blockStatus.blockedByYou) {
        await api.delete(`/blocks/${profile.id}`, { withCredentials: true });
        setBlockStatus({ ...blockStatus, blockedByYou: false });
      } else {
        Alert.alert(
          "Confirmar bloqueo",
          `¿Estás seguro de que deseas bloquear a @${profile.username}?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Bloquear",
              style: "destructive",
              onPress: async () => {
                await api.post(`/blocks/${profile.id}`, {}, { withCredentials: true });
                setBlockStatus({ ...blockStatus, blockedByYou: true });
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Error bloqueando:", err);
    } finally {
      setLoadingBlock(false);
    }
  };

  const handleFollowToggle = async () => {
    setLoadingFollow(true);
    try {
      if (followStatus.isFollowing) {
        await api.delete(`/follow/${profile.id}`);
        setFollowStatus({ ...followStatus, isFollowing: false });
      } else {
        await api.post(`/follow/${profile.id}`);
        setFollowStatus({ ...followStatus, isFollowing: true });
      }
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const isBlocked = blockStatus.blockedByYou || blockStatus.blockedByThem;

  return (
    <View style={styles.container}>
      {/* Botón Seguir / Siguiendo */}
      <Button
        mode={followStatus.isFollowing ? "outlined" : "contained"}
        onPress={handleFollowToggle}
        disabled={loadingFollow || isBlocked}
        style={[
          styles.button,
          { borderColor: theme.colors.primary },
        ]}
        textColor={
          followStatus.isFollowing ? theme.colors.primary : theme.colors.onPrimary
        }
        icon={() =>
          loadingFollow ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : (
            <Icon
              source={
                followStatus.isFollowing ? "account-remove" : "account-plus"
              }
              size={18}
              color={
                followStatus.isFollowing
                  ? theme.colors.primary
                  : theme.colors.onPrimary
              }
            />
          )
        }
      >
        {loadingFollow
          ? "Procesando..."
          : blockStatus.blockedByThem
          ? "No disponible"
          : followStatus.isFollowing
          ? "Siguiendo"
          : "Seguir"}
      </Button>

      {/* Botón Bloquear / Desbloquear */}
      <Button
        mode="outlined"
        onPress={handleBlockToggle}
        disabled={loadingBlock}
        style={[
          styles.button,
          {
            borderColor: theme.colors.error,
            backgroundColor: blockStatus.blockedByYou
              ? theme.colors.surfaceVariant
              : theme.colors.errorContainer,
          },
        ]}
        textColor={
          blockStatus.blockedByYou
            ? theme.colors.onSurfaceVariant
            : theme.colors.error
        }
        icon={() =>
          loadingBlock ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <Icon
              source={blockStatus.blockedByYou ? "lock-open" : "block-helper"}
              size={18}
              color={
                blockStatus.blockedByYou
                  ? theme.colors.onSurfaceVariant
                  : theme.colors.error
              }
            />
          )
        }
      >
        {loadingBlock
          ? "Procesando..."
          : blockStatus.blockedByYou
          ? "Desbloquear"
          : "Bloquear"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  button: {
    borderRadius: 20,
    minWidth: 130,
    height: 38,
    justifyContent: "center",
  },
});
