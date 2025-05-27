import { io } from "socket.io-client";

// socket.js
let socket = null;

export const initSocket = (userId) => {
  socket = io("http://localhost:5001", {
    withCredentials: true,
    query: { userId },
  });

  return socket;
};

export const getSocket = () => socket;
