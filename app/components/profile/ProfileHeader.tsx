import { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Avatar, Divider, useTheme } from "react-native-paper";
import ProfileActions from "./ProfileActions";
import { Settings } from "lucide-react-native";
import api from "../../../api/api";
import { useNavigation } from "@react-navigation/native";
import { User, BlockStatus, FollowStatus } from "../../../types/user";

interface Props {
  profile: User;
  isOwnProfile: boolean;
  blockStatus: BlockStatus;
  setBlockStatus: (s: BlockStatus) => void;
  followStatus: FollowStatus;
  setFollowStatus: (s: FollowStatus) => void;
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
  const [imageOk, setImageOk] = useState<boolean | null>(null);
  const navigation = useNavigation()
  // Traer bandera
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

  // Check de imagen
  useEffect(() => {
    setImageOk(null);
    const url = profile.profile_picture_url;
    if (!url) {
      setImageOk(false);
      return;
    }

    Image.prefetch(url)
      .then(() => setImageOk(true))
      .catch(() => setImageOk(false));
  }, [profile.profile_picture_url]);

  const initials = (profile.displayname || profile.username || "")
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View style={styles.container}>
      
      {/* HEADER HERO */}
      <View
        style={[styles.headerHero, { backgroundColor: theme.colors.primary }]}
      />

      {/* BOTÓN DE AJUSTES (si es tu perfil) */}
      {isOwnProfile && (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsHome" as never)}
          style={styles.settingsButton}
        >
          <Settings size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      )}

      {/* AVATAR */}
      <View style={styles.avatarWrapper}>
        {imageOk === true && profile.profile_picture_url ? (
          <Avatar.Image
            size={150}
            source={{ uri: profile.profile_picture_url }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text size={150} label={initials || "U"} style={styles.avatar} />
        )}
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <Text style={[styles.username, { color: theme.colors.onBackground }]}>
          {profile.username}
        </Text>

        {profile.displayname && (
          <Text
            style={[
              styles.displayname,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {profile.displayname}
          </Text>
        )}

        {/* BOTÓN EDITAR PERFIL */}
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfilePage" as never)}
            style={[
              styles.editButton,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Editar perfil
            </Text>
          </TouchableOpacity>
        )}

        {/* BIO */}
        <Text
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

        {/* ACTIONS SEGUIR/BLOQUEAR */}
        {!isOwnProfile && (
          <View style={styles.actionsWrapper}>
            <ProfileActions
              profile={profile}
              blockStatus={blockStatus}
              setBlockStatus={setBlockStatus}
              followStatus={followStatus}
              setFollowStatus={setFollowStatus}
            />
          </View>
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

            {flag && <Image source={{ uri: flag }} style={styles.flag} />}
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            {[
              { label: "Publicaciones", value: profile.posts_count },
              { label: "Seguidores", value: profile.followers_count },
              { label: "Seguidos", value: profile.following_count },
            ].map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statNumber}>{s.value ?? 0}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider style={{ marginTop: 25, width: "100%" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  headerHero: {
    width: "100%",
    height: 170,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    opacity: 0.98,
  },

  /* --- BOTÓN AJUSTES --- */
  settingsButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
    padding: 10,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  avatarWrapper: {
    position: "absolute",
    top: 100,
    zIndex: 5,
  },
  avatar: {
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#eee",
    elevation: 10,
  },
  content: {
    marginTop: 120,
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  username: {
    fontSize: 32,
    fontWeight: "800",
  },
  displayname: {
    fontSize: 17,
    marginTop: 3,
  },

  /* --- BOTÓN EDITAR PERFIL --- */
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  bio: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: "90%",
  },

  actionsWrapper: { marginTop: 18 },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  locationText: { fontSize: 15 },
  flag: {
    width: 20,
    height: 14,
    marginLeft: 6,
    borderRadius: 3,
  },

  statsCard: {
    width: "92%",
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 13, opacity: 0.7, marginTop: 2 },
});
