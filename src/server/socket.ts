import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

export const initSocketIO = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket.io',
    transports: ["websocket", "polling"]
  });
  
  io.on("connection", (socket) => {
    console.log("[Socket.IO] New client connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("[Socket.IO] Client disconnected:", socket.id);
    });
  });
  
  return io;
};

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}