import React, { useState, useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import { Card, TextInput, Button, Switch, Text, ActivityIndicator } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../context/AuthBase";
import { fetchWeatherByCity } from "../../services/weatherService";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type CrearPostProps = {
  onCreated?: (createdPost?: any) => void;
};

export default function CrearPost({ onCreated }: CrearPostProps = {}) {
  const [contenido, setContenido] = useState("");

  // archivos
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerSuccessResult[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Mensajes y loading
  const [loading, setLoading] = useState(false);
  const [message, setMessage] =
    useState<{ type: "success" | "error" | null; text: string | null }>({
      type: null,
      text: null,
    });

  // clima
  const [attachWeather, setAttachWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const { user } = useAuth();

  // TYPE GUARD
  function isSuccessResult(
    res: DocumentPicker.DocumentPickerResult
  ): res is DocumentPicker.DocumentPickerSuccessResult {
    return res.type === "success";
  }

  // PICK DE ARCHIVO
  const handleFilePick = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: false,
    });

    if (isSuccessResult(res)) {
      const updated = [...files, res].slice(0, 4);
      setFiles(updated);
      setPreviews(updated.map((f) => f.uri));
    }
  };

  // FETCH CLIMA
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!attachWeather) return;
        if (!user?.city) return;

        const w = await fetchWeatherByCity(user.city, (user as any).country_iso);
        if (mounted) setWeatherData(w);
      } catch (e) {
        console.warn("fetch weather for post failed", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [attachWeather, user?.city, user?.country_iso]);

  // SUBMIT POST
  const handleSubmit = async () => {
    if (!user) {
      return setMessage({ type: "error", text: "Debes iniciar sesión" });
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", contenido);

      if (attachWeather && weatherData) {
        formData.append("weather", JSON.stringify(weatherData));
      }

      for (const f of files) {
        formData.append("files", {
          uri: f.uri,
          name: f.name,
          type: f.mimeType ?? "application/octet-stream",
        } as any);
      }

      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        return setMessage({ type: "error", text: json?.error || "Error creando post" });
      }

      // limpiar
      setContenido("");
      setFiles([]);
      setPreviews([]);
      setMessage({ type: "success", text: "Post creado correctamente" });

      onCreated?.(json?.post);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Error al crear el post",
      });
    } finally {
      setLoading(false);
    }
  };

  // RENDER
  return (
    <Card style={{ margin: 8, borderRadius: 12 }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Crear nuevo post
        </Text>

        <TextInput
          label="Contenido / Descripción"
          value={contenido}
          onChangeText={setContenido}
          multiline
          numberOfLines={4}
          style={{ marginBottom: 8 }}
        />

        <Button mode="outlined" onPress={handleFilePick} style={{ marginBottom: 8 }}>
          Adjuntar archivos (máx 4)
        </Button>

        <ScrollView horizontal style={{ marginBottom: 8 }}>
          {previews.map((p, idx) => (
            <View key={idx} style={{ marginRight: 8 }}>
              <Image
                source={{ uri: p }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
              />
              <Button
                compact
                onPress={() => {
                  const nf = files.filter((_, i) => i !== idx);
                  setFiles(nf);
                  setPreviews(nf.map((f) => f.uri));
                }}
              >
                Quitar
              </Button>
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text>Adjuntar clima actual</Text>
          <Switch value={attachWeather} onValueChange={setAttachWeather} />
        </View>

        {attachWeather && weatherData && (
          <Text>
            {Math.round(weatherData.current.temp)}° •{" "}
            {weatherData.current.weather?.[0]?.description}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={loading}
          style={{ marginBottom: 8 }}
        >
          {loading ? <ActivityIndicator animating /> : "Publicar"}
        </Button>

        <Button
          mode="text"
          onPress={() => {
            setContenido("");
            setFiles([]);
            setPreviews([]);
          }}
        >
          Limpiar
        </Button>

        {message.text && (
          <Text
            style={{
              color: message.type === "error" ? "red" : "green",
              marginTop: 8,
            }}
          >
            {message.text}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}
