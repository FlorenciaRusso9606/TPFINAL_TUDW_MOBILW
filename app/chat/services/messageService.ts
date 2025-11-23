import api from '../lib/api';

export async function getConversations() {
  const r = await api.get('/messages/conversations');
  return r.data;
}

export async function getMessagesWith(userId: number | string) {
  const r = await api.get(`/messages/${userId}`);
  return r.data;
}

export async function sendMessage(payload: { toUserId: number | string; content?: string; media?: any[] }) {
  const r = await api.post('/messages', payload);
  return r.data;
}
