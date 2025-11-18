import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton, TextInput, Text, Button } from "react-native-paper";
import ModalBase from "../common/Modal";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const REPORT_REASONS = [
  "Contenido inapropiado",
  "Discurso de odio",
  "Acoso o bullying",
  "Spam",
  "Otro",
];

export default function ReportDialog({
  open,
  onClose,
  onSubmit,
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleConfirm = () => {
    const reason =
      selectedReason === "Otro" && customReason ? customReason : selectedReason;
    if (reason.trim()) {
      onSubmit(reason);
      setSelectedReason("");
      setCustomReason("");
    }
    onClose();
  };
  const disableConfirm =
    !selectedReason || (selectedReason === "Otro" && !customReason.trim());


  return (
    <ModalBase
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Reportar publicación"
      confirmText="Enviar reporte"
      disableConfirm={
       disableConfirm
      }
    >
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.label}>Motivo del reporte</Text>
        <RadioButton.Group
          onValueChange={(value) => setSelectedReason(value)}
          value={selectedReason}
        >
        {REPORT_REASONS.map((reason) => (
            <View key={reason} style={styles.option}>
              <RadioButton value={reason} />
              <Text>{reason}</Text>
            </View>
          ))}
        </RadioButton.Group>
        {selectedReason === "Otro" && (
          <TextInput
            label="Especifique el motivo"
            mode="outlined"
            multiline
            value={customReason}
            onChangeText={setCustomReason}
            style={styles.textInput}
          />
        )}
      </View>
    </ModalBase>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 8,
  },
  label: {
    marginBottom: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  textInput: {
    marginTop: 8,
  },
});