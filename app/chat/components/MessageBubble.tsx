import { useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useThemeContext } from "../../../context/ThemeContext";

type Message = {
  id: string;
  sender_id: string;
  content?: string;
  text?: string;
  image?: string;
  created_at: string;
};

export default function MessageBubble({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string;
}) {
  const { theme } = useThemeContext();

  const mine = message.sender_id === currentUserId;

  const formattedDate = useMemo(
    () =>
      new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [message.created_at]
  );

  const textToShow = message.text || message.content || "";

  return (
    <View
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "75%",
        marginVertical: theme.spacing(0.5),
        marginHorizontal: theme.spacing(1),
      }}
    >
      <View
        style={{
          backgroundColor: mine
            ? theme.colors.primary
            : theme.colors.surfaceVariant ?? theme.colors.surface,

          padding: theme.spacing(1.25),
          borderRadius: theme.radius.md,

          borderBottomRightRadius: mine ? 0 : theme.radius.md,
          borderBottomLeftRadius: mine ? theme.radius.md : 0,
        }}
      >
        {!!textToShow && (
          <Text
            style={{
              color: mine ? theme.colors.onPrimary : theme.colors.text,
            }}
          >
            {textToShow}
          </Text>
        )}

        {message.image ? (
          <Image
            source={{ uri: message.image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: theme.radius.md,
              marginTop: theme.spacing(0.5),
            }}
          />
        ) : null}

        <Text
          style={{
            fontSize: 11,
            marginTop: theme.spacing(0.5),
            color: theme.colors.textSecondary,
            alignSelf: "flex-end",
          }}
        >
          {formattedDate}
        </Text>
      </View>
    </View>
  );
}
