import { View, StyleSheet, Modal, Pressable } from "react-native";
import {
  Avatar,
  Button,
  TextInput,
  ActivityIndicator,
  Card,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "../../../schemas/commentSchema";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthBase";
import { useThemeContext } from "../../../context/ThemeContext";
import EmojiModal from "react-native-emoji-modal";
import { useState } from "react";
import { Smile } from "lucide-react-native";

interface Props {
  postId: string | number;
  parentId?: string | number | null;
  onSubmit: (
    data: CommentFormData,
    parentId?: string | number | null
  ) => Promise<void>;
}

const CommentForm: React.FC<Props> = ({ onSubmit, parentId }) => {
  const { control, handleSubmit, reset, formState } =
    useForm<CommentFormData>({
      resolver: zodResolver(commentSchema),
    });

  const { user } = useAuth();
  const { errors, isSubmitting } = formState;
  const { theme } = useThemeContext();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleFormSubmit = async (data: CommentFormData) => {
    try {
      await onSubmit(data, parentId);
      reset({ text: "" });
      Toast.show({
        type: "success",
        text1: "Comentario publicado ✅",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al publicar comentario",
      });
    }
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.row}>
        <Avatar.Image
          size={36}
          source={
            user?.profile_picture_url
              ? { uri: user.profile_picture_url }
              : require("../../../assets/default-avatar-icon.jpg")
          }
        />

        <View style={styles.inputContainer}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <>
                {/* INPUT */}
                <View style={{ position: "relative" }}>
                  <TextInput
                    {...field}
                    value={field.value}
                    mode="outlined"
                    placeholder="Escribe un comentario..."
                    multiline
                    numberOfLines={1}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.dark
                          ? "#252525"
                          : "#f5f5f5",
                        borderColor: errors.text
                          ? theme.colors.error
                          : "transparent",
                      },
                    ]}
                    onChangeText={field.onChange}
                    error={!!errors.text}
                  />

                  {/* BOTÓN EMOJI */}
                  <Pressable
                    onPress={() => setShowEmojiPicker(true)}
                    style={styles.emojiButton}
                  >
                    <Smile
                      size={22}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                </View>

                {/* MODAL EMOJI */}
                <Modal
                  visible={showEmojiPicker}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowEmojiPicker(false)}
                >
                  <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowEmojiPicker(false)}
                  >
                    <Pressable
                      style={[
                        styles.modalContent,
                        {
                          backgroundColor: theme.dark
                            ? "#1c1c1e"
                            : "#fff",
                        },
                      ]}
                      onPress={(e) => e.stopPropagation()}
                    >
                      <EmojiModal
                        onEmojiSelected={(emoji) => {
                          field.onChange((field.value ?? "" )+ emoji);
                          setShowEmojiPicker(false);
                        }}
                        columns={8}
                        modalStyle={{ backgroundColor: "transparent" }}
                      />
                    </Pressable>
                  </Pressable>
                </Modal>
              </>
            )}
          />

          {errors.text && (
            <View style={styles.errorContainer}>
              <Button
                compact
                textColor={theme.colors.error}
                labelStyle={styles.errorText}
              >
                {errors.text.message}
              </Button>
            </View>
          )}

          {/* BOTÓN PUBLICAR */}
          <View style={styles.submitRow}>
            <Button
              mode="contained"
              compact
              disabled={isSubmitting}
              onPress={handleSubmit(handleFormSubmit)}
              style={styles.submitButton}
              labelStyle={styles.submitLabel}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Publicar"
              )}
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default CommentForm;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    position: "relative",
  },
  textInput: {
    borderRadius: 16,
    fontSize: 15,
    minHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 45, 
    borderWidth: 1,
    flex: 1,
  },
  emojiButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 20,
    elevation: 20,
    padding: 4,
  },
  errorContainer: {
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
  },
  submitRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  submitButton: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 4,
    elevation: 3,
  },
  submitLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    padding: 14,
    borderRadius: 20,
    width: "100%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 20,
    elevation: 10,
  },
});
