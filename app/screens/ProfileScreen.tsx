import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import ProfilePhotoPicker from '../components/ProfilePhotoPicker';

export default function ProfileScreen() {
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text variant="titleLarge">Perfil</Text>
            {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
            )}

            <Button mode="contained" onPress={() => setPickerOpen(true)} style={{ marginTop: 12 }}>
                Cambiar foto de perfil
            </Button>

            {pickerOpen && (
                <ProfilePhotoPicker
                    onComplete={(uri) => {
                        setAvatarUri(uri);
                        setPickerOpen(false);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: 'center' },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', marginTop: 16 },
    avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
});