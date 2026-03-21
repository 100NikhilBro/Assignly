import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token?: string) => {
  if (!socket) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Reconnect if server disconnected
        socket?.connect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });
  }

  return socket;
};

export const connectSocket = (token?: string) => {
  const socket = getSocket(token);
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join assignment room for real-time updates
export const joinAssignmentRoom = (assignmentId: string, token?: string) => {
  const socket = connectSocket(token);
  socket.emit("join-assignment", assignmentId);
  return socket;
};

// Listen to assignment updates
export const onAssignmentUpdate = (
  assignmentId: string,
  callback: (data: any) => void,
  token?: string
) => {
  const socket = connectSocket(token);
  socket.on(`assignment:${assignmentId}`, callback);
  
  return () => {
    socket.off(`assignment:${assignmentId}`);
  };
};

export default getSocket;