import { io, Socket } from "socket.io-client";
import { env } from "../server/config/env"; // Import backend environment configuration
// import { Chat } from "./types";

let socket: Socket | null = null;

export const initSocket = (onHumanMessage: (data: any) => void) => {
  console.log("[SocketHandler] Connecting to:", env.socket.path);
  socket = io(env.socket.path, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    withCredentials: true,
    auth: {
      token: "client-connection",
    },
  });

  let retryCount = 0;
  const maxRetries = 3;

  const tryConnection = () => {
    console.log(`[SocketHandler] Connection attempt ${retryCount + 1}/${maxRetries}`);
    socket?.connect();
  };

  socket.on("connect_error", (error) => {
    console.error("[SocketHandler] Socket connection error:", error.message);
    if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(tryConnection, 2000);
    }
  });

  socket.on("connect", () => {
    console.log("[SocketHandler] Socket connected successfully:", socket?.id);
    retryCount = 0;
  });

  socket.on("disconnect", () => {
    console.log("[SocketHandler] Socket disconnected");
  });

  socket.on("humanMessage", (data: any) => {
    console.log("[SocketHandler] Received humanMessage:", data);
    // console.log("[App] Current humanChats state:", humanChats);
    // console.log("[App] Current selectedChat:", selectedChat);
    onHumanMessage(data);
  });
};

export const cleanupSocket = () => {
  console.log("[SocketHandler] Cleaning up socket connection");
  socket?.close();
};