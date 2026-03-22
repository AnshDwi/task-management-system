import { io } from "socket.io-client";

let socketInstance = null;

export function getSocket() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (!socketInstance) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const socketUrl = apiBaseUrl.replace(/\/api$/, "");

    socketInstance = io(socketUrl, {
      autoConnect: false,
      auth: {
        token,
      },
    });
  }

  socketInstance.auth = { token };

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
