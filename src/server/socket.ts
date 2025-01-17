import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { env } from './config/env';

// dotenv.config();
let io: SocketIOServer;

export const initSocketIO = (server: HTTPServer) => {
  console.log("[Socket] Initializing Socket.IO with config...");
  console.log("[Socket] CORS origins:", env.socket.cors.origin);
  
  // const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [];

  // Initialize Socket.IO server
  io = new SocketIOServer(server, {
    cors: {
      origin: env.socket.cors.origin,
      methods: env.socket.cors.methods,
      credentials: env.socket.cors.credentials,
    },
    transports: ["websocket", "polling"],
  });

  // io = new SocketIOServer(server, {
  //   cors: {
  //     origin: corsOrigins,
  //     methods: ["GET", "POST", "OPTIONS"],
  //     credentials: true,
  //     allowedHeaders: ["my-custom-header"]
  //   },
  //   transports: ['websocket', 'polling']
  // });

  // Socket.IO connection event
  io.on("connection", (socket) => {
    console.log("[Socket] Connection successful:", {
      id: socket.id,
      transport: socket.conn.transport.name,
      origin: socket.handshake.headers.origin,
      time: new Date().toISOString(),
    });

    // Handle socket disconnection
    socket.on("disconnect", (reason) => {
      console.log("[Socket] Client disconnected:", {
        id: socket.id,
        reason,
        time: new Date().toISOString(),
      });
    });

    // Handle transport upgrades
    socket.conn.on("upgrade", (transport) => {
      console.log("[Socket] Transport upgraded:", {
        id: socket.id,
        transport: transport.name,
      });
    });
  });

  return io;
};

export function getIO() {
  if (!io) {
    throw new Error("[Socket] Socket.IO has not been initialized!");
  }
  return io;
}