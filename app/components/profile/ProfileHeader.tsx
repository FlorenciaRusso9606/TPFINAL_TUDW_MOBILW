import { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Avatar, Divider, useTheme } from "react-native-paper";
import { Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../api/api";
import ProfileActions from "./ProfileActions";
import { User, BlockStatus, FollowStatus } from "../../../types/user";
import { useNavigation } from "@react-navigation/core";

interface Props {
  profile: User;
  isOwnProfile: boolean;
  blockStatus: BlockStatus;
  setBlockStatus: (status: BlockStatus) => void;
  followStatus: FollowStatus;
  setFollowStatus: (status: FollowStatus) => void;
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
  const navigation = useNavigation();

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
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
    <View
  style={[
    styles.headerGradient,
    { backgroundColor: theme.colors.primary }
  ]}
/>
      {/* BOTÓN AJUSTES */}
      {isOwnProfile && (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsHome" as never)}
          style={styles.settingsButton}
        >
          <Settings size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      )}

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        {profile.profile_picture_url ? (
          <Avatar.Image
            source={{ uri: profile.profile_picture_url }}
            size={150}
            style={{
              ...styles.avatar,
              borderColor: theme.colors.background,
              backgroundColor: theme.colors.elevation.level1,
            }}
          />
        ) : (
          <Avatar.Text
            size={150}
            label={profile.username.charAt(0).toUpperCase()}
            style={{
              ...styles.avatar,
              borderColor: theme.colors.background,
              backgroundColor: theme.colors.primaryContainer,
            }}
            color={theme.colors.onPrimaryContainer}
          />
        )}
      </View>

      {/* INFO */}
      <View style={styles.infoContainer}>
        <Text
          variant="headlineSmall"
          style={[
            styles.username,
            { color: theme.colors.onBackground },
          ]}
        >
          {profile.username}
        </Text>

        {profile.displayname && (
          <Text
            variant="titleSmall"
            style={[
              styles.displayname,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {profile.displayname}
          </Text>
        )}

        {/* BOTÓN EDITAR */}
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditProfilePage" as never)
            }
            style={[
              styles.editButton,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text
              style={{
                ...styles.editButtonText,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Editar perfil
            </Text>
          </TouchableOpacity>
        )}

        {/* BIO */}
        <Text
          variant="bodyMedium"
          style={[
            styles.bio,
            {
              color: profile.bio
                ? theme.colors.onSurface
                : theme.colors.onSurfaceDisabled,
              fontStyle: profile.bio ? "normal" : "italic",
            },
          ]}
        >
          {profile.bio || "Este usuario no tiene biografía"}
        </Text>

        {/* ACCIONES SEGUIR/BLOQUEAR */}
        {!isOwnProfile && (
          <ProfileActions
            profile={profile}
            blockStatus={blockStatus}
            setBlockStatus={setBlockStatus}
            followStatus={followStatus}
            setFollowStatus={setFollowStatus}
          />
        )}

        {/* UBICACIÓN */}
        {(profile.city || profile.country_iso) && (
          <View style={styles.locationRow}>
            <Text
              style={[
                styles.locationText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {profile.city
                ? `${profile.city}${profile.country_iso ? ", " : ""}`
                : ""}
              {profile.country_iso}
            </Text>
            {flag && (
              <Image
                source={{ uri: flag }}
                style={styles.flagImage}
              />
            )}
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsRow}>
          {[
            { label: "publicaciones", value: profile.posts_count },
            { label: "seguidores", value: profile.followers_count },
            { label: "seguidos", value: profile.following_count },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text
                style={[
                  styles.statNumber,
                  { color: theme.colors.onBackground },
                ]}
              >
                {s.value ?? 0}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        <Divider
          style={{
            marginTop: 20,
            width: "100%",
            backgroundColor: theme.colors.outlineVariant,
          }}
        />
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
    height: 160,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  settingsButton: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 5,
  },
  avatarContainer: {
    position: "absolute",
    top: 90,
    left: "50%",
    transform: [{ translateX: -75 }],
    zIndex: 10,
  },
  avatar: {
    borderWidth: 4,
  },
  infoContainer: {
    marginTop: 180,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  username: {
    fontWeight: "700",
    marginTop: 10,
  },
  displayname: {
    marginTop: 4,
    marginBottom: 8,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
  },
  editButtonText: {
    fontSize: 14,
  },
  bio: {
    marginTop: 10,
    textAlign: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {},
  flagImage: {
    width: 18,
    height: 12,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "700",
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
  },
});
