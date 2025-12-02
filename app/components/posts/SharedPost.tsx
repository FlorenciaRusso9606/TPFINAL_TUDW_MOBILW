import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, Surface, useTheme } from "react-native-paper";
import AuthorHeader from "./AuthorHeader";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import { reportPost } from "../../../services/postService";
import { X } from "lucide-react-native";

export default function SharedPost({ post }: any) {
  const theme = useTheme();

  const sharedBy = post?.author;
  const originalPost = post?.shared_post;
  const originalAuthor = originalPost?.author;

  if (!originalPost || !originalAuthor) return null;

  return (
    <Surface style={[styles.container]} elevation={1}>
      <View style={styles.header}>
        <Text
          variant="bodyMedium"
          style={[
            styles.sharedByText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Compartido por {sharedBy?.displayname || sharedBy?.username || "Usuario"}
        </Text>

        <IconButton
          icon={() => (
            <X size={18} color={theme.colors.onSurfaceVariant} />
          )}
          accessibilityLabel="Cerrar reposteo"
          style={styles.icon}
          onPress={() => {}}
        />
      </View>

      <Surface
        style={[
          styles.originalPost,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        elevation={0}
      >
        <AuthorHeader
          author={originalAuthor}
          actions={
            <PostActions
              onEdit={() => {}}
              onDelete={() => {}}
              onReport={async (reason: string) => {
                await reportPost(originalPost.id, reason);
              }}
              loading={false}
              isOwn={false}
            />
          }
        />

        <PostBody
          post={originalPost}
          description={originalPost.text}
        />
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sharedByText: {
    fontStyle: "italic",
  },
  icon: {
    margin: 0,
  },
  originalPost: {
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
});
