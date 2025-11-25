import { useState, useEffect } from "react";
import { Menu, TextInput } from "react-native-paper";
import { View } from "react-native";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

export default function SelectInput({ label, value, onChange, options, disabled }: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  // Valor visible en el input
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  // Filtrado por búsqueda (case insensitive)
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Cada vez que cambian las opciones, cierro el menú
    setVisible(false);
  }, [options]);

  return (
    <View style={{ marginBottom: 16, zIndex: 999 }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            label={label}
            value={visible ? search : selectedLabel} // Muestra búsqueda o el valor final
            onFocus={() => {
              setVisible(true);
              setSearch(selectedLabel); // Al abrir, prellena con el valor actual
            }}
            onChangeText={(text) => {
              setSearch(text);
              setVisible(true);
            }}
            right={<TextInput.Icon icon="menu-down" />}
            editable={!disabled}
          />
        }
      >
        {/* Si no hay coincidencias */}
        {filtered.length === 0 && (
          <Menu.Item title="Sin resultados" disabled />
        )}

        {/* Opciones filtradas */}
        {filtered.map((opt, index) => (
          <Menu.Item
            key={`${opt.value}-${index}`}
            onPress={() => {
              onChange(opt.value);
              setVisible(false);
              setSearch("");
            }}
            title={opt.label}
          />
        ))}
      </Menu>
    </View>
  );
}
