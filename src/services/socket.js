import { io } from 'socket.io-client';
import { Config } from './config';

let socket = null;

function getSocketBaseUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.replace(/\/$/, '');
  }
  const api = Config.serverAPIUrl || '';
  return api.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
}

export function getSocket() {
  if (socket) return socket;

  socket = io(getSocketBaseUrl(), {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    autoConnect: false,
  });

  return socket;
}

export function connectSocket(userId) {
  const s = getSocket();
  if (!userId) return s;

  if (!s.connected) {
    s.connect();
  }

  s.emit('join-user-room', { userId });
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}
