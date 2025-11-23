import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken() {
  try {
    const t = await AsyncStorage.getItem('token');
    return t;
  } catch {
    return null;
  }
}

export async function setToken(t: string) {
  try {
    await AsyncStorage.setItem('token', t);
  } catch {}
}
