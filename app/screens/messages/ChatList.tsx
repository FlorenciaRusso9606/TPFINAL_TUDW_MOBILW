import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getConversations, getMe } from '../../chat/services/messageService';
import { useIsFocused } from "@react-navigation/native";

export default function ChatList({ navigation }: any) {
  const [convs, setConvs] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);

  const isFocused = useIsFocused();

  // Obtener mi usuario una sola vez
  useEffect(() => {
    getMe().then(user => {
      setMyId(user?.id || null);
    });
  }, []);

  // Fetch de conversaciones solo cuando vuelve al foco
  useEffect(() => {
    if (isFocused) {
      getConversations().then(r => setConvs(r || []));
    }
  }, [isFocused]);

  if (!myId) return <Text style={styles.loading}>Cargando usuario...</Text>;

  return (
    <View style={styles.container}>
      
      {/* Botón simple de nuevo chat */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() =>
          navigation.navigate("SearchConversation", { currentUserId: myId })
        }
      >
        <Text style={styles.newChatText}>＋ Nuevo chat</Text>
      </TouchableOpacity>

      <FlatList
        data={convs}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No tenés chats todavía</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatScreen", {
                userId: item.otherUser.id,
                currentUserId: myId,
              })
            }
          >
            <View style={styles.row}>
              <Text style={styles.name}>
                {item.otherUser.displayname || item.otherUser.username}
              </Text>

              <Text style={styles.lastMessage}>
                {item.lastMessage?.text || "Sin mensajes"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#fff",
  },

  loading: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
  },

  newChatButton: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 14,
  },

  newChatText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2b7cff",
  },

  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },

  lastMessage: {
    fontSize: 13,
    color: "#666",
  },

  empty: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
});
