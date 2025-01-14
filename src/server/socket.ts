// /home/ubuntu/Documents/wts_dashboard/src/server/socket.ts
import { Server as SocketIOServer } from "socket.io";
import type http from "http";

let io: SocketIOServer;

export function initSocketIO(server: http.Server) {
  io = new SocketIOServer(server, {
    cors: { origin: "*" }, // or your domain if you like
  });
  io.on("connection", (socket) => {
    console.log("New Socket.IO client connected:", socket.id);
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
