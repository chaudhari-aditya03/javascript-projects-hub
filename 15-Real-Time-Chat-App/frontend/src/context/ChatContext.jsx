import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

/**
 * Chat Context
 * Manages chat state, conversations, and messaging
 */
const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState({});
  const [loading, setLoading] = useState(false);

  const addMessage = useCallback((userId, message) => {
    setMessages(prev => {
      const userMessages = prev[userId] || [];
      // Avoid duplicates
      const messageExists = userMessages.some(m => m.id === message.id);
      if (messageExists) return prev;
      
      return {
        ...prev,
        [userId]: [...userMessages, message]
      };
    });
  }, []);

  const clearMessages = useCallback((userId) => {
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[userId];
      return newMessages;
    });
  }, []);

  const updateTyping = useCallback((userId, isTyping) => {
    setTyping(prev => ({
      ...prev,
      [userId]: isTyping
    }));
  }, []);

  const updateOnlineUsers = useCallback((users) => {
    setOnlineUsers(users);
  }, []);

  const value = {
    conversations,
    setConversations,
    messages,
    setMessages,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    setOnlineUsers,
    typing,
    setTyping,
    loading,
    setLoading,
    addMessage,
    clearMessages,
    updateTyping,
    updateOnlineUsers
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
