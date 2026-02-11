import React, { useEffect } from 'react';
import Header from './Header';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import socketService from '../services/socket';
import { userAPI, messageAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * Chat Page Component
 * Main chat interface with user list and message window
 */
export default function ChatPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const {
    selectedUser,
    setSelectedUser,
    messages,
    addMessage,
    onlineUsers,
    updateOnlineUsers,
    typing
  } = useChat();

  // Connect to WebSocket on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const connectSocket = async () => {
      try {
        socketService.connect(token, () => {
          console.log('WebSocket connected');
        }, (err) => {
          console.error('WebSocket connection error:', err);
        });

        // Listen to socket events
        const unsubscribeMessage = socketService.on('message', (data) => {
          addMessage(data.sender_id, {
            id: data.id,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            content: data.content,
            created_at: data.timestamp,
            is_seen: false
          });
        });

        const unsubscribeOnline = socketService.on('online_users', (data) => {
          updateOnlineUsers(data.users);
        });

        return () => {
          unsubscribeMessage();
          unsubscribeOnline();
        };
      } catch (err) {
        console.error('Socket connection failed:', err);
      }
    };

    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, [token, navigate, addMessage, updateOnlineUsers]);

  const handleSelectUser = async (selectedUserData) => {
    setSelectedUser(selectedUserData);
    
    // Load conversation history
    try {
      const conversationMessages = await messageAPI.getConversationMessages(selectedUserData.id);
      // Clear previous messages and load new ones
      // This is handled by the messageAPI call and chat context
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleSendMessage = (receiverId, content) => {
    if (socketService.connected()) {
      socketService.sendMessage(receiverId, content);
    } else {
      console.error('WebSocket not connected');
    }
  };

  const handleTyping = (receiverId, isTyping) => {
    if (socketService.connected()) {
      socketService.sendTyping(receiverId, isTyping);
    }
  };

  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  const currentUserMessages = selectedUser ? messages[selectedUser.id] || [] : [];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header onLogout={handleLogout} />

      <div className="flex-1 flex overflow-hidden">
        {/* User List - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:flex w-80 flex-shrink-0">
          <UserList onSelectUser={handleSelectUser} selectedUserId={selectedUser?.id} />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex">
          <ChatWindow
            user={selectedUser}
            messages={currentUserMessages}
            onSendMessage={handleSendMessage}
            isTyping={selectedUser && typing[selectedUser.id]}
            onTypingChange={handleTyping}
          />
        </div>
      </div>
    </div>
  );
}
