import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log(`Connected with socket ID: ${socket?.id}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
      socket = null;
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log(`Disconnected: ${socket?.id}`);
    socket.disconnect();
    socket = null;
  }
};
