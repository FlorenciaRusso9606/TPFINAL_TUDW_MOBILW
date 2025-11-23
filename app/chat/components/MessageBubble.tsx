import React from 'react';
import { View, Text } from 'react-native';

export default function MessageBubble({ message }: { message: any }) {
  const mine = message.sender_id === 'me';
  return (
    <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', margin: 8 }}>
      <View style={{ backgroundColor: mine ? '#cfe9ff' : '#eee', padding: 10, borderRadius: 8 }}>
        <Text>{message.content}</Text>
        <Text style={{ fontSize: 10, color: '#666' }}>{new Date(message.created_at).toLocaleString()}</Text>
      </View>
    </View>
  );
}
