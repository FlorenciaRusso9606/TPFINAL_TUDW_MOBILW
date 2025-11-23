import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { getMessagesWith, sendMessage } from '../services/messageService';
import useSocket from '../hooks/useSocket';

export default function ChatScreen({ route }: any) {
  const { userId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    getMessagesWith(userId).then(r => setMessages(r || []));
  }, [userId]);

  const onMessage = useCallback((m: any) => setMessages(prev => [...prev, m]), []);
  const { send } = useSocket(onMessage);

  const handleSend = async (text: string) => {
    const temp = { id: `t-${Date.now()}`, content: text, sender_id: 'me', created_at: new Date().toISOString() };
    setMessages(prev => [...prev, temp]);
    send({ toUserId: userId, content: text });
    try {
      await sendMessage({ toUserId: userId, content: text });
    } catch (e) {
      // handle error
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={messages} renderItem={({ item }) => <MessageBubble message={item} />} keyExtractor={m => m.id.toString()} />
      <MessageInput onSend={handleSend} />
    </View>
  );
}
