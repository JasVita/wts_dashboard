import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

export const initSocketIO = (server: HTTPServer) => {
  console.log("[Socket] Initializing with config...");
  io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:8080", "https://portal.turoid.ai"],
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["my-custom-header"]
    },
    transports: ['websocket', 'polling']
  });

  // Connection lifecycle logging
  io.on("connection", (socket) => {
    console.log("[Socket] Connection successful:", {
      id: socket.id,
      transport: socket.conn.transport.name,
      origin: socket.handshake.headers.origin,
      time: new Date().toISOString()
    });
    
    // Track disconnection
    socket.on("disconnect", (reason) => {
      console.log("[Socket] Client disconnected:", {
        id: socket.id,
        reason,
        time: new Date().toISOString()
      });
    });

    // Track transport changes
    socket.conn.on("upgrade", (transport) => {
      console.log("[Socket] Transport upgraded:", {
        id: socket.id,
        transport: transport.name
      });
    });
  });

  return io;
};

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}