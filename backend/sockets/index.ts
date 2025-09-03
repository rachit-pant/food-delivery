import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';

interface JwtPayload {
  id: number;
  role: number;
}
declare module 'socket.io' {
  interface Socket {
    user?: JwtPayload;
  }
}
function socketLoader(io: Server) {
  const onlineUsers = new Map<number, string[]>();

  function jwtAuthSocket(socket: Socket, next: (err?: Error) => void) {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error('No cookie'));

      const cookies = parse(rawCookie);
      const token = cookies.refreshtoken;
      if (!token) return next(new Error('No token in cookies'));
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_SECRET_KEY as string
      ) as JwtPayload;
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  }

  io.use(jwtAuthSocket);

  io.on('connection', (socket) => {
    console.log(
      `✅ User ${socket.user?.id} connected with socket ${socket.id}`
    );
    if (socket.user?.id) {
      const existing = onlineUsers.get(socket.user.id) || [];
      onlineUsers.set(socket.user.id, [...existing, socket.id]);
    }

    socket.on('disconnect', () => {
      if (socket.user?.id) {
        const existing = onlineUsers.get(socket.user.id) || [];
        const updated = existing.filter((id) => id !== socket.id);
        if (updated.length === 0) {
          onlineUsers.delete(socket.user.id);
        } else {
          onlineUsers.set(socket.user.id, updated);
          //need to look at later
        }
      }
    });
  });

  return onlineUsers;
}

module.exports = socketLoader;
