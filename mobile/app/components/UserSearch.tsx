import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { TextInput, List, Avatar, Card } from "react-native-paper";
import api from "../../api/api";
import type { User } from "../../types/user";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";


export default function UserSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/search", {
          params: { search: q },
          withCredentials: true,
        });
        setResults(res.data.results);
      } catch (err) {
        console.error("Search error: ", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserProfile", { username: item.username })}
    >
      <List.Item
        title={item.displayname || item.username}
        description={`@${item.username}`}
        left={() =>
          item.profile_picture_url ? (
            <Avatar.Image size={40} source={{ uri: item.profile_picture_url }} />
          ) : (
            <Avatar.Text size={40} label={item.username[0].toUpperCase()} />
          )
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ width: "100%", position: "relative" }}>
      <TextInput
        label="Buscar usuario"
        value={q}
        onChangeText={setQ}
        mode="outlined"
        style={{ marginBottom: 8 }}
      />

      {results.length > 0 && (
        <Card style={{ maxHeight: 300, position: "absolute", top: 60, left: 0, right: 0, zIndex: 10 }}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </Card>
      )}
    </View>
  );
}
