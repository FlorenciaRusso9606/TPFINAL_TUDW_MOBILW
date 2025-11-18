import { Text } from "react-native-paper"
export default function SettingsScreen(){
    return(
        <Text>Hola mundo</Text>
    )
}
/*
import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text, TextInput, Button, Surface } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import api from "@tpfinal/api";
import { editProfilSchema, ProfileData } from "@tpfinal/schemas";
import { useAuth } from "@tpfinal/context";

export default function EditProfilePage() {
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProfileData>({
    resolver: zodResolver(editProfilSchema),
    defaultValues: {
      displayname: "",
      bio: "",
      password: "",
      new_password: "",
      profile_picture_url: undefined,
      country_iso: "",
      city: "",
    },
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();
  const bioValue = watch("bio") || "";
  const bioLength = bioValue.length;
  const maxBioLength = 160;

  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const countryIso = useWatch({ control, name: "country_iso" });

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await api.get("/countries/list");
        setCountries(res.data.map((c: any) => ({ label: c.name, value: c.code })));
      } catch {
        console.error("Error fetching countries");
      }
    }
    fetchCountries();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!countryIso) return setCities([]);
    (async () => {
      try {
        const res = await api.get(`/countries/${countryIso}/city`);
        setCities(res.data.map((c: any) => ({ label: c.name, value: c.name })));
      } catch {
        setCities([]);
      }
    })();
  }, [countryIso]);

  // Fetch user
  useEffect(() => {
    async function fetchMe() {
      setLoading(true);
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        const user = res.data;
        setUserId(user.id);
        setValue("displayname", user.displayname ?? "");
        setValue("bio", user.bio ?? "");
        setValue("city", user.city ?? "");
        if (user.country_iso) setValue("country_iso", user.country_iso.toUpperCase());
      } catch {
        console.error("No auth");
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [setValue]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setValue("profile_picture_url", result);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    if (!userId) return;
    const formData = new FormData();
    formData.append("displayname", data.displayname);
    if (data.password) formData.append("password", data.password);
    if (data.new_password) formData.append("new_password", data.new_password);
    if (data.bio) formData.append("bio", data.bio);
    if (data.profile_picture_url) {
      const uriParts = data.profile_picture_url.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("profile_picture_url", {
        uri: data.profile_picture_url.uri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }
    if (data.city) formData.append("city", data.city);
    if (data.country_iso) formData.append("country_iso", data.country_iso.toUpperCase());

    try {
      const res = await api.put(`/users/${userId}`, formData, { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error updating profile");
    }
  };

  if (loading) return <Text>Cargando perfil...</Text>;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Surface style={{ padding: 16, borderRadius: 8, elevation: 4 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Editar Perfil</Text>

        <Controller
          name="country_iso"
          control={control}
          render={({ field }) => (
            <TextInput
              label="País"
              value={field.value}
              onChangeText={(text) => {
                field.onChange(text);
                setValue("city", "");
              }}
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Ciudad"
              value={field.value}
              onChangeText={field.onChange}
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Controller
          name="displayname"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Nombre de Usuario"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.displayname}
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Bio"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Contraseña anterior"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Nueva contraseña"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              style={{ marginBottom: 12 }}
            />
          )}
        />

        <Button mode="contained" onPress={pickImage} style={{ marginBottom: 12 }}>
          Elegir foto de perfil
        </Button>

        <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </Surface>
    </ScrollView>
  );
}

 */