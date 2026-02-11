/**
 * WebSocket Service
 * Handles real-time communication with backend
 */

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.messageQueue = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.heartbeatInterval = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token, onConnect, onError) {
    try {
      const url = `${WS_BASE_URL}/ws?token=${token}`;
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send queued messages
        this.messageQueue.forEach(msg => this.socket.send(msg));
        this.messageQueue = [];

        // Start heartbeat
        this.startHeartbeat();

        if (onConnect) onConnect();
        this.emit('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
        this.emit('error', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.stopHeartbeat();
        this.emit('disconnected');
        this.attemptReconnect(token, onConnect, onError);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      if (onError) onError(error);
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  attemptReconnect(token, onConnect, onError) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (onError) onError(new Error('Connection failed'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnect in ${delay}ms...`);
    setTimeout(() => this.connect(token, onConnect, onError), delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'ping'
        });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Send message through WebSocket
   */
  send(data) {
    const message = JSON.stringify(data);
    
    if (this.isConnected && this.socket) {
      this.socket.send(message);
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      console.warn('WebSocket not connected, message queued');
    }
  }

  /**
   * Send chat message
   */
  sendMessage(receiverId, content) {
    this.send({
      type: 'message',
      receiver_id: receiverId,
      content
    });
  }

  /**
   * Send typing indicator
   */
  sendTyping(receiverId, isTyping) {
    this.send({
      type: 'typing',
      receiver_id: receiverId,
      is_typing: isTyping
    });
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.listeners = {};
    this.messageQueue = [];
  }

  /**
   * Check if connected
   */
  connected() {
    return this.isConnected;
  }
}

// Export singleton instance
export default new SocketService();
