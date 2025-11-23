import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';
import { getToken } from '../utils/auth';

export default function useSocket(onMessage: (m: any) => void) {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const jwt = await getToken();
        const resp = await api.get('/auth/socket-token', { headers: { Authorization: `Bearer ${jwt}` } });
        const token = resp.data?.token;
        if (!token) return;

        socketRef.current = io(process.env.BACKEND_URL || 'http://localhost:4000', {
          auth: { token },
          transports: ['websocket'],
        });

        socketRef.current.on('connect', () => console.log('socket connected', socketRef.current.id));
        socketRef.current.on('dm_message', (m: any) => mounted && onMessage?.(m));
      } catch (e) {
        console.warn('useSocket error', e);
      }
    }

    start();
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, [onMessage]);

  const send = (payload: any) => socketRef.current?.emit('dm_message', payload);
  return { send, socketRef };
}
