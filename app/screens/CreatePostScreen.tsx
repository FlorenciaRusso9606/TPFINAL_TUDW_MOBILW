import { useState, useEffect } from "react";
import { View, Image, ScrollView , Pressable} from "react-native";
import { Card, TextInput, Button, Switch, Text, ActivityIndicator  } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthBase";
import { fetchWeatherByCity } from "../../services/weatherService";
import api from "../../api/api";
import { Platform, ToastAndroid, Alert } from "react-native";
import { Wind } from "lucide-react-native";
import { useThemeContext } from "context/ThemeContext";
type MediaFile = {
  uri: string;
  name: string;
  type: string;
  previewType: "image" | "video";
};

export default function CreatePostScreen({ navigation }: any) {
  const [contenido, setContenido] = useState("");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const {theme} = useThemeContext()
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string | null;
  }>({ type: null, text: null });

  const [attachWeather, setAttachWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const { user } = useAuth();

const showToast = (msg: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert("", msg);
  }
};

  // PICK IMAGEN O VIDEO
  const pickImageOrVideo = async () => {
  //  Pedir permisos
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Necesitas otorgar permisos para acceder a la galería.");
    return;
  }

  //  Abrir picker
const res = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images", "videos"],  // ← usa strings
  quality: 1,
});


  if (!res.canceled) {
    const asset = res.assets[0];

    const previewType = asset.type === "video" ? "video" : "image";

    const newFile: MediaFile = {
      uri: asset.uri,
      name: asset.fileName ?? `media_${Date.now()}`,
      type:
        asset.mimeType ??
        (asset.type === "video" ? "video/mp4" : "image/jpeg"),
      previewType,
    };

    setFiles((prev) => [...prev, newFile].slice(0, 4));
  }
};


  // FETCH WEATHER
  useEffect(() => {
    if (!attachWeather || !user?.city) return;

    let mounted = true;

    (async () => {
      try {
        const w = await fetchWeatherByCity(user.city, (user as any).country_iso);
        if (mounted) setWeatherData(w);
      } catch (err) {
        console.error("Error clima", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [attachWeather, user?.city]);

  // SUBMIT
  const handleSubmit = async () => {
    if (!user) {
      return setMessage({ type: "error", text: "Debes iniciar sesión" });
    }

    if (!contenido.trim() && files.length === 0) {
      return setMessage({
        type: "error",
        text: "El post no puede estar vacío",
      });
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("text", contenido);

      if (attachWeather && weatherData) {
        formData.append("weather", JSON.stringify(weatherData));
      }

      // ARCHIVOS
      files.forEach((f) => {
        formData.append("files", {
          uri: f.uri.startsWith("file://") ? f.uri : "file://" + f.uri,
          name: f.name,
          type: f.type,
        } as any);
      });


      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // limpiar
      setContenido("");
      setFiles([]);

      setMessage({ type: "success", text: "Post creado correctamente" });

      navigation.navigate("Feed");
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.message || "Error al crear el post",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ borderRadius: 12 }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            Crear nuevo post
          </Text>

          <TextInput
            label="Contenido"
            value={contenido}
            onChangeText={setContenido}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 12 }}
          />

          {/* BOTÓN PICKER */}
          <Button
            mode="outlined"
            onPress={pickImageOrVideo}
            style={{ marginBottom: 12 }}
          >
            Elegir imagen o video (máx 4)
          </Button>

          {/* PREVIEWS */}
          <ScrollView horizontal style={{ marginBottom: 12 }}>
            {files.map((f, idx) => (
              <View key={idx} style={{ marginRight: 12 }}>
                <Image
                  source={{ uri: f.uri }}
                  style={{ width: 90, height: 90, borderRadius: 8 }}
                />
                <Button
                  compact
                  onPress={() =>
                    setFiles((p) => p.filter((_, i) => i !== idx))
                  }
                >
                  Quitar
                </Button>
              </View>
            ))}
          </ScrollView>

          {/* WEATHER */}
          <View style={{ alignItems: "flex-start", marginBottom: 12 }}>
  <Pressable
  accessible={true}
    onPress={async () => {
      const newState = !attachWeather;
      setAttachWeather(newState);

      if (newState) {
        if (weatherData) {
          const temp = Math.round(weatherData.current.temp);
          const desc =
            weatherData.current.weather?.[0]?.description ?? "";
          showToast(`Clima agregado: ${temp}° ${desc}`);
        } else {
          showToast("Obteniendo clima...");
        }
      } else {
        showToast("Clima desactivado");
      }
    }}
    accessibilityRole="button"
    accessibilityLabel={
      attachWeather ? "Desactivar clima" : "Activar clima"
    }
accessibilityState={{ selected: attachWeather }}
    style={{
      borderRadius: 8,
      borderColor: "#ccc",
      borderWidth: 1,
      width: 44,   
      height: 44,  
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Wind size={24} color= {theme.colors.primary} />
  </Pressable>

  <Text style={{ fontSize: 12, opacity: 0.7 }}>
    {attachWeather ? "Clima activado" : "Agregar clima"}
  </Text>
</View>

          {attachWeather && weatherData && (
            <Text style={{ marginBottom: 12 }}>
              {Math.round(weatherData.current.temp)}° •{" "}
              {weatherData.current.weather?.[0]?.description}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={{ marginBottom: 12 }}
          >
            {loading ? <ActivityIndicator /> : "Publicar"}
          </Button>

          <Button
            mode="text"
            onPress={() => {
              setContenido("");
              setFiles([]);
            }}
          >
            Limpiar
          </Button>

          {message.text && (
            <Text
              style={{
                color: message.type === "error" ? "red" : "green",
                marginTop: 10,
              }}
            >
              {message.text}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
