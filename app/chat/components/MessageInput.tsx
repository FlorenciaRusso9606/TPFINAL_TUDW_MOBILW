import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <View style={{ flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee' }}>
      <TextInput style={{ flex: 1, padding: 8 }} value={text} onChangeText={setText} placeholder="Mensaje" />
      <Button title="Enviar" onPress={() => { if (text.trim()) { onSend(text); setText(''); } }} />
    </View>
  );
}
