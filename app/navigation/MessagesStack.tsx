import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '../screens/messages/ChatList';
import ChatScreen from '../screens/messages/ChatScreen';
import SearchConversation from "../screens/messages/SearchConversation"
const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator
      id={"messagesStack" as never}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="ChatList" component={ChatList} options={{ title: 'Tus Mensajes' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen
        name="SearchConversation"
        component={SearchConversation}
        options={{ title: "Buscar usuario" }}
      />
    </Stack.Navigator>
  );
}
