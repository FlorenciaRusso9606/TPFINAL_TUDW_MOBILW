import React from "react";
import { View } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import { User } from "../../../types/user";

interface BlockStatus {
  blockedByYou: boolean;
  blockedByThem: boolean;
}

interface Props {
  blockStatus: BlockStatus;
  profile: User;
  onUnblock: () => Promise<void>;
}

export default function BlockStatusMessage({ blockStatus, profile, onUnblock }: Props) {
  const theme = useTheme();

  if (blockStatus.blockedByYou && blockStatus.blockedByThem) {
    return (
      <Card style={{ marginVertical: 8, backgroundColor: theme.colors.surfaceVariant }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Bloqueo mutuo
          </Text>
          <Text>
            Tú y <Text style={{ fontWeight: "bold" }}>{profile.username}</Text> se tienen bloqueados.
          </Text>
          <Button mode="contained" onPress={onUnblock} style={{ marginTop: 8 }}>
            Desbloquear
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (blockStatus.blockedByYou) {
    return (
      <Card style={{ marginVertical: 8, backgroundColor: theme.colors.surfaceVariant }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Usuario bloqueado
          </Text>
          <Text>
            Has bloqueado a <Text style={{ fontWeight: "bold" }}>{profile.username}</Text>.
          </Text>
          <Button mode="contained" onPress={onUnblock} style={{ marginTop: 8 }}>
            Desbloquear
          </Button>
        </Card.Content>
      </Card>
    );
  }

  if (blockStatus.blockedByThem) {
    return (
      <Card style={{ marginVertical: 8, backgroundColor: theme.colors.errorContainer }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.onErrorContainer }}>
            Acceso restringido
          </Text>
          <Text style={{ color: theme.colors.onErrorContainer }}>
            <Text style={{ fontWeight: "bold" }}>{profile.username}</Text> te ha bloqueado.{"\n"}
            No podrás ver su información ni interactuar con este usuario.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return null;
}
