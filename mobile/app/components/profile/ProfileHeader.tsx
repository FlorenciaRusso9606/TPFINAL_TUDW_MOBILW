import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Avatar, Divider, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../api/api";
import ProfileActions from "./ProfileActions";
import { User, BlockStatus, FollowStatus } from "../../../types/user";

interface Props {
  profile: User;
  isOwnProfile: boolean;
  blockStatus: BlockStatus;
  setBlockStatus: (status: BlockStatus) => void;
  followStatus: FollowStatus;
  setFollowStatus: (status: FollowStatus) => void;
  onFollowChange?: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile,
  blockStatus,
  setBlockStatus,
  followStatus,
  setFollowStatus,
}: Props) {
  const theme = useTheme();
  const [flag, setFlag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlag() {
      if (!profile.country_iso) return;
      try {
        const res = await api.get(`/countries/${profile.country_iso}/flag`);
        setFlag(res.data.flag);
      } catch (err) {
        console.error("Error al traer la bandera:", err);
      }
    }
    fetchFlag();
  }, [profile.country_iso]);

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        style={styles.headerGradient}
      />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {profile.profile_picture_url ? (
          <Avatar.Image
            source={{ uri: profile.profile_picture_url }}
            size={150}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={150}
            label={profile.username.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
        )}
      </View>

      {/* Info principal */}
      <View style={styles.infoContainer}>
        <Text variant="headlineSmall" style={styles.username}>
          {profile.username}
        </Text>

        {profile.displayname ? (
          <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {profile.displayname}
          </Text>
        ) : null}

        <Text
          variant="bodyMedium"
          style={{
            color: profile.bio ? theme.colors.onSurface : theme.colors.onSurfaceDisabled,
            fontStyle: profile.bio ? "normal" : "italic",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {profile.bio || "Este usuario no tiene biografía"}
        </Text>

        {!isOwnProfile && (
          <ProfileActions
            profile={profile}
            blockStatus={blockStatus}
            setBlockStatus={setBlockStatus}
            followStatus={followStatus}
            setFollowStatus={setFollowStatus}
          />
        )}

        {/* Ciudad y país */}
        {(profile.city || profile.country_iso) && (
          <View style={styles.locationRow}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {profile.city
                ? `${profile.city}${profile.country_iso ? ", " : ""}`
                : ""}
              {profile.country_iso}
            </Text>
            {flag && (
              <Image
                source={{ uri: flag }}
                style={{ width: 18, height: 12, marginLeft: 6 }}
              />
            )}
          </View>
        )}

        {/* Estadísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="titleSmall" style={styles.statNumber}>
              {profile.posts_count ?? 0}
            </Text>
            <Text variant="bodySmall">publicaciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleSmall" style={styles.statNumber}>
              {profile.followers_count ?? 0}
            </Text>
            <Text variant="bodySmall">seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleSmall" style={styles.statNumber}>
              {profile.following_count ?? 0}
            </Text>
            <Text variant="bodySmall">seguidos</Text>
          </View>
        </View>

        <Divider style={{ marginTop: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  headerGradient: {
    height: 150,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: "absolute",
    top: 75,
    left: "50%",
    transform: [{ translateX: -75 }],
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#E0E0E0",
    borderWidth: 4,
    borderColor: "#fff",
    elevation: 4,
  },
  infoContainer: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  username: {
    fontWeight: "700",
    textAlign: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "700",
  },
});
