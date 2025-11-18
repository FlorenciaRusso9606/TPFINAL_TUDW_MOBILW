import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, Surface, useTheme } from "react-native-paper";
import AuthorHeader from "./AuthorHeader";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import { reportPost } from "../../../services/postService";
import { X } from "lucide-react-native";

export default function SharedPost({ post }: any) {
  const theme = useTheme();
  const sharedBy = post.author; // Usuario que compartió
  const originalPost = post.shared_post; // Post original
  const originalAuthor = originalPost?.author;
  const [hasShared, setHasShared] = useState(true); // Simula que ya fue compartido

  if (!originalPost || !originalAuthor) return null;

  return (
    <Surface style={styles.container} elevation={1}>
      {/*  Header: autor que compartió */}
      <View style={styles.header}>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, fontStyle: "italic" }}
        >
          Compartido por {sharedBy.displayname || sharedBy.username}
        </Text>

        <IconButton
          icon={() => (
            <X  size={18} color={theme.colors.onSurfaceVariant} />
          )}
          accessibilityLabel="Reposteo"
          style={styles.icon}
        />
      </View>
      {/* Post original */}
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
        <PostBody post={originalPost} description={originalPost.text} />
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
    gap: 4,
    marginBottom: 6,
  },
  icon: {
    margin: 0,
  },
  originalPost: {
    borderRadius: 8,
    padding: 12,
  },
});
