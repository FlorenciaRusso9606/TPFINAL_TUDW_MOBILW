import { View, StyleSheet } from "react-native";
import { Avatar, Button, TextInput, ActivityIndicator, Card } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, CommentFormData } from "../../../schemas/commentSchema";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthBase";
import { useThemeContext } from "../../../context/ThemeContext";


interface Props {
  postId: string | number;
  parentId?: string | number | null;
  onSubmit: (data: CommentFormData, parentId?: string | number | null) => Promise<void>;
}

const CommentForm: React.FC<Props> = ({ onSubmit, parentId }) => {
  const { control, handleSubmit, reset, formState } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const { errors, isSubmitting } = formState;
  const { user } = useAuth();
  const {theme} = useThemeContext();

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
              : require("../../assets/default-avatar-icon.jpg")
          }
        />

        <View style={styles.inputContainer}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                mode="outlined"
                placeholder="Escribe un comentario..."
                multiline
                dense
                style={styles.textInput}
                error={!!errors.text}
                onChangeText={field.onChange}
              />
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
    borderRadius: 12,
    padding: 8,
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    borderRadius: 12,
    fontSize: 14,
    minHeight: 60,
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
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  submitLabel: {
    textTransform: "none",
    fontWeight: "600",
    fontSize: 14,
  },
});
