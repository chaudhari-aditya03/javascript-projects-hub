import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../services/api';

/**
 * Chat Window Component
 * Displays messages and handles message input
 */
export default function ChatWindow({ user, messages = [], onSendMessage, isTyping = false, onTypingChange }) {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversation history
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user?.id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      await messageAPI.getConversationMessages(user.id);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    try {
      onSendMessage(user.id, messageText);
      setMessageText('');
      
      // Stop typing indicator
      if (onTypingChange) {
        onTypingChange(user.id, false);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    // Send typing indicator
    if (onTypingChange) {
      onTypingChange(user.id, true);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingChange) {
        onTypingChange(user.id, false);
      }
    }, 3000);
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-lg font-medium">Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.username}</div>
            <div className={`text-xs ${user.is_online ? 'text-green-600' : 'text-gray-500'}`}>
              {user.is_online ? 'Online' : `Last seen ${new Date(user.last_seen).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === user.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === user.id ? 'text-gray-600' : 'text-blue-100'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="text-xs text-gray-500 italic">
              {user.username} is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="h-20 px-4 py-3 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
