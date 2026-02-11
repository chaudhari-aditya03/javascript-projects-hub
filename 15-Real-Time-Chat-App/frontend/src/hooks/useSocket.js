import { useState, useCallback } from 'react';

/**
 * Custom hook for WebSocket operations
 */
export const useSocket = (socket) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (token) => {
    return new Promise((resolve, reject) => {
      socket.connect(
        token,
        () => {
          setIsConnected(true);
          setError(null);
          resolve();
        },
        (err) => {
          setError(err);
          reject(err);
        }
      );
    });
  }, [socket]);

  const disconnect = useCallback(() => {
    socket.disconnect();
    setIsConnected(false);
  }, [socket]);

  const sendMessage = useCallback((receiverId, content) => {
    socket.sendMessage(receiverId, content);
  }, [socket]);

  const sendTyping = useCallback((receiverId, isTyping) => {
    socket.sendTyping(receiverId, isTyping);
  }, [socket]);

  const onMessage = useCallback((callback) => {
    return socket.on('message', callback);
  }, [socket]);

  const onTyping = useCallback((callback) => {
    return socket.on('typing', callback);
  }, [socket]);

  const onOnlineUsers = useCallback((callback) => {
    return socket.on('online_users', callback);
  }, [socket]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    onMessage,
    onTyping,
    onOnlineUsers
  };
};
