import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Client] Connected to real-time server with id:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [Socket.io Client] Disconnected from server');
    });
  }
  return socket;
};

export const subscribeToNewBookings = (callback) => {
  const s = getSocket();
  s.on('new_booking_alert', callback);
  return () => s.off('new_booking_alert', callback);
};

export const subscribeToBookingStatusUpdates = (callback) => {
  const s = getSocket();
  s.on('booking_status_updated', callback);
  return () => s.off('booking_status_updated', callback);
};

export const subscribeToFleetUpdates = (callback) => {
  const s = getSocket();
  s.on('fleet_updated', callback);
  return () => s.off('fleet_updated', callback);
};

export const sendSupportMessage = (messageData) => {
  const s = getSocket();
  s.emit('support_message', messageData);
};

export const subscribeToSupportReplies = (callback) => {
  const s = getSocket();
  s.on('sahayak_reply', callback);
  return () => s.off('sahayak_reply', callback);
};

export const getSocketStatus = () => {
  const s = getSocket();
  return {
    connected: Boolean(s && s.connected),
    id: s?.id || 'live-socket-session'
  };
};

export const subscribeToStatusUpdates = subscribeToBookingStatusUpdates;

export const sendFleetUpdate = (data) => {
  const s = getSocket();
  s.emit('client_fleet_sync', data);
};

export default getSocket;

