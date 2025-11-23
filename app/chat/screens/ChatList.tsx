import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getConversations } from '../services/messageService';

export default function ChatList({ navigation }: any) {
  const [convs, setConvs] = useState<any[]>([]);
  useEffect(() => {
    getConversations().then(r => setConvs(r || []));
  }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={convs}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { userId: item.otherUserId })}>
            <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text>{item.otherUserName || item.username}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{item.lastMessage?.content}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
