import { useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Surface } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfilePhotoPicker from "../../components/ProfilePhotoPicker";
import api from "../../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editProfilSchema, ProfileData } from "../../../schemas/editProfile";
import { useAuth } from "../../../context/AuthBase";

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
  const [sending, setSending] = useState(false);
  const { setUser } = useAuth();
  const bioValue = watch("bio") || "";
  const bioLength = bioValue.length;
  const maxBioLength = 160;

  const profilePicture = watch("profile_picture_url") as any;

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

  // Fetch cities teniendo el país
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


  const onSubmit = async (data: ProfileData) => {
    if (!userId) return;
    console.log("EditProfile: submitting", { userId, data });
    setSending(true);
    const formData = new FormData();
    formData.append("displayname", data.displayname);
    if (data.password) formData.append("password", data.password);
    if (data.new_password) formData.append("new_password", data.new_password);
    if (data.bio) formData.append("bio", data.bio);
    if (data.city) formData.append("city", data.city);
    if (data.country_iso) formData.append("country_iso", data.country_iso.toUpperCase());

    try {
      let uri: string | undefined;
      let fileName: string | undefined;
      let mime: string | undefined;
      let fileObj: any = null;

      if (data.profile_picture_url) {
        console.log("Profile picture raw value:", data.profile_picture_url);
      }
      if (data.profile_picture_url && data.profile_picture_url.uri) {
        uri = data.profile_picture_url.uri as string;
        console.log("Profile picture uri:", uri);
        const uriNoQuery = uri.split('?')[0].split('#')[0];
        const uriParts = uriNoQuery.split('.');
        const fileType = (uriParts[uriParts.length - 1] || 'jpg').toLowerCase();
        fileName = `profile.${fileType}`;
        mime = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;

        let appended = false;
        try {
          if (uri.startsWith('file://') || uri.startsWith('/data') || uri.startsWith('/storage')) {
            throw new Error('Local file URI - skip fetch');
          }
          const fetched = await fetch(uri);
          const blob = await fetched.blob();
          formData.append('profile_picture_url', blob, fileName as any);
          appended = true;
          console.log('Appended image as blob', { fileName, mime });
        } catch (e) {
          console.warn('Could not fetch image as blob or skipping fetch for local file, falling back to file object append', e);
        }

        if (!appended) {
          try {
            fileObj = { uri, name: fileName, type: mime };
            const fieldNames = ['profile_picture_url', 'profile_picture', 'avatar', 'image', 'file'];
            fieldNames.forEach((field) => formData.append(field, fileObj as any));
            console.log('Appended image as file object under multiple fields', fileObj);
          } catch (e) {
            console.error('Failed to append file object', e);
          }
        }
      }

      Alert.alert('Enviando', 'Subiendo perfil...');

      if (data.profile_picture_url && data.profile_picture_url.uri) {
        try {
          const base = (api as any).defaults?.baseURL || '';
          const url = `${base.replace(/\/$/, '')}/users/${userId}`;
          const token = await AsyncStorage.getItem('token');
          console.log('Uploading via fetch to', url);
          let resFetch = await fetch(url, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            body: formData,
          });

          let respText = await resFetch.text().catch(() => '');
          console.log('Fetch upload status', resFetch.status);
          console.log('Fetch response text', respText);

          if (!resFetch.ok && /MulterError: Unexpected field/i.test(respText)) {
            console.warn('Detected Multer Unexpected field, retrying with alternate field names');
            const candidateFields = ['avatar','profile_picture','profile_picture_url','image','file','files'];
            let succeeded = false;
            for (const field of candidateFields) {
              try {
                const trialForm = new FormData();
                if (data.displayname) trialForm.append('displayname', data.displayname);
                if (data.password) trialForm.append('password', data.password);
                if (data.new_password) trialForm.append('new_password', data.new_password);
                if (data.bio) trialForm.append('bio', data.bio);
                if (data.city) trialForm.append('city', data.city);
                if (data.country_iso) trialForm.append('country_iso', data.country_iso.toUpperCase());
                if (!fileObj) {
                  fileObj = { uri, name: fileName, type: mime } as any;
                }
                trialForm.append(field, fileObj as any);

                console.log('Retrying upload with field', field);
                const r2 = await fetch(url, {
                  method: 'PUT',
                  headers: {
                    Accept: 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined,
                  },
                  body: trialForm,
                });
                const txt2 = await r2.text().catch(() => '');
                console.log('Retry', field, 'status', r2.status, 'resp', txt2);
                if (r2.ok) {
                  let j2 = null;
                  try { j2 = txt2 ? JSON.parse(txt2) : null; } catch {}
                  setUser(j2?.user || j2);
                  Alert.alert('Perfil', 'Perfil actualizado correctamente');
                  succeeded = true;
                  break;
                }
              } catch (ee) {
                console.warn('Retry error for field', field, ee);
              }
            }
            if (!succeeded) {
              Alert.alert('Error', `Server responded ${resFetch.status}: ${respText}`);
            }
          } else {
            let json: any = null;
            try { json = respText ? JSON.parse(respText) : null; } catch {}
            if (resFetch.ok) {
              setUser(json?.user || json);
              Alert.alert('Perfil', 'Perfil actualizado correctamente');
            } else {
              Alert.alert('Error', `Server responded ${resFetch.status}: ${respText}`);
            }
          }
        } catch (e) {
          console.error('Fetch upload error', e);
          Alert.alert('Error', `Error subiendo perfil: ${e?.message || e}`);
        }
      } else {
        const res = await api.put(`/users/${userId}`, formData, {
          withCredentials: true,
          timeout: 30000,
        });
        console.log("EditProfile: response", res && res.status);
        setUser(res.data.user);
        Alert.alert("Perfil", "Perfil actualizado correctamente");
      }
    } catch (err: any) {
      console.error("Error updating profile", err);
      Alert.alert("Error", err?.message || "Error actualizando perfil");
    } finally {
      setSending(false);
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

        {profilePicture?.uri && (
          <Image source={{ uri: profilePicture.uri }} style={styles.avatar} />
        )}

        <ProfilePhotoPicker
          renderTrigger={(open) => (
            <Button mode="contained" onPress={open} style={{ marginBottom: 12 }}>
              Elegir foto de perfil
            </Button>
          )}
          onComplete={(uri) => setValue("profile_picture_url", { uri })}
        />

        <Button
          mode="contained"
          onPress={() => {
            const data = watch();
            onSubmit(data as ProfileData);
          }}
          disabled={isSubmitting || sending}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
});

 