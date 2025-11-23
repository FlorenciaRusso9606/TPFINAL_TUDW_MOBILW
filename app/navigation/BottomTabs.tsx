import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import { Home, MessageSquare, Settings, Plus, Search , User} from "lucide-react-native";
import FeedScreen from "../screens/FeedScreen";
import MessagesScreen from "../screens/MessagesScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import SearchScreen from "../screens/SearchScreen"; 
import ProfileStack from "app/navigation/ProfileStack";
import type { LucideProps } from "lucide-react-native";
import MessagesStack from "./MessagesStack";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const theme = useTheme();

  return (
<Tab.Navigator
  screenOptions={{
    tabBarShowLabel: false, 
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: "#999",
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 0.5,
      borderTopColor: "#ccc",
      height: 85,        
      paddingBottom: 20, 
      paddingTop: 5,
    },
  }}
>



      {/* INICIO */}
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* BUSCAR */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

      {/* CREAR POST */}
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <Plus size={38} color={theme.colors.primary} />
          ),
          tabBarItemStyle: {
            marginBottom: 10,
          },
        }}
      />

      {/* MENSAJES */}
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />

      {/* PERFIL  */}
 <Tab.Screen
  name="ProfileStack"
  component={ProfileStack}
  options={{
    headerShown: false,
    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
  }}
/>
    </Tab.Navigator>
  );
}
