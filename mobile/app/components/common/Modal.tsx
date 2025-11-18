import { ReactNode, useEffect, useState } from "react";
import {
  Portal,
  Dialog,
  IconButton,
  Text,
  Button
} from "react-native-paper";
import { View } from "react-native";
import { X } from 'lucide-react-native';
import { useThemeContext } from "../../../context/ThemeContext";
interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  disableConfirm?: boolean;
}

export default function ModalBase({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  disableConfirm = false,
}: ModalBaseProps) {
  const [mounted, setMounted] = useState(false);
  const {theme} = useThemeContext();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 👈 evita renderizar en SSR

  return (
    <Portal>
    <Dialog
      visible={open}
      onDismiss={onClose}
      style={{ borderRadius: 12,
          backgroundColor: theme.colors.background,}}

    >
      {title && (
        <View
          style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
        >
            <Text variant="titleMedium">{title}</Text>
          <IconButton icon={() => (<X  size={20} color={theme.colors.onSurface} />
              )}  onPress={onClose}/>
          
        </View>
      )}

            <Dialog.Content>
          <View style={{ marginTop: 8 }}>{children}</View>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onClose} textColor={theme.colors.onSurface}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              onPress={onConfirm}
              mode="contained"
              disabled={disableConfirm}
            >
              {confirmText}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
