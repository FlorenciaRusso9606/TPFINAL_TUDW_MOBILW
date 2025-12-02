import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, IconButton, Dialog, Portal, Button, Text } from "react-native-paper";
import { X, Edit, EllipsisVertical, Flag } from "lucide-react-native";
import { useThemeContext } from "../../../context/ThemeContext";

interface PostActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onReport: (reason: string) => void;
  loading?: boolean;
  isOwn: boolean;
}

export default function PostActions({
  onEdit,
  onDelete,
  onReport,
  loading,
  isOwn,
}: PostActionsProps) {

  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const { theme } = useThemeContext();

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon={() => <EllipsisVertical size={24} color={theme.colors.text} />}
            onPress={() => setMenuVisible(true)}
          />
        }
        contentStyle={{
          backgroundColor: theme.colors.surface,
        }}
      >
        {isOwn ? (
          <>
            <Menu.Item
              onPress={() => {
                onEdit();
                setMenuVisible(false);
              }}
              title="Editar"
              leadingIcon={() => <Edit size={20} color={theme.colors.text} />}
              titleStyle={{ color: theme.colors.text }}
            />

            <Menu.Item
              onPress={() => {
                onDelete();
                setMenuVisible(false);
              }}
              title="Eliminar"
              leadingIcon={() => <X size={20} color={theme.colors.danger} />}
              titleStyle={{ color: theme.colors.text }}
              disabled={loading}
            />
          </>
        ) : (
          <Menu.Item
            onPress={() => {
              setReportVisible(true);
              setMenuVisible(false);
            }}
            title="Reportar"
            leadingIcon={() => <Flag size={20} color={theme.colors.warning} />}
            titleStyle={{ color: theme.colors.text }}
            disabled={loading}
          />
        )}
      </Menu>

      {/* Modal Reporte */}
      <Portal>
        <Dialog
          visible={reportVisible}
          onDismiss={() => setReportVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>
            Reportar publicación
          </Dialog.Title>

          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              ¿Querés reportar esta publicación?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setReportVisible(false)} textColor={theme.colors.text}>
              Cancelar
            </Button>

            <Button
              onPress={() => {
                onReport("Inapropiado");
                setReportVisible(false);
              }}
              buttonColor={theme.colors.danger}
              textColor={theme.colors.onPrimary}
            >
              Reportar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
});
