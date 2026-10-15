import { useEffect } from "react";

import socket from "../utils/socket/socket";

export default function useSocket(userId) {
  useEffect(() => {
    // Don't connect until authenticated user is available
    if (!userId) {
      return;
    }

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      // Register authenticated user with socket server
      socket.emit("register-user", {
        userId,
      });
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.disconnect();
    };
  }, [userId]);

  return socket;
}
