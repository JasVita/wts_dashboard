import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

export const initSocketIO = (server: HTTPServer) => {
  console.log("[Socket] Initializing with config...");
  io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:8080", "https://portal.turoid.ai"], // Add all frontend URLs
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["my-custom-header"]
    },
    path: '/socket.io',
    transports: ["polling", "websocket"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Add namespace connection debug
  io.on("connection", (socket) => {
    console.log("[Socket] Client connected:", {
      id: socket.id,
      origin: socket.handshake.headers.origin,
      transport: socket.conn.transport.name
    });
    
    socket.on("disconnect", (reason) => {
      console.log("[Socket] Client disconnected:", { id: socket.id, reason });
    });
  });

  return io;
};

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}