import { io } from "socket.io-client";

export const socket = io("https://project-aurora-29zc.onrender.com", {
  withCredentials: true,
  autoConnect: false,
});


