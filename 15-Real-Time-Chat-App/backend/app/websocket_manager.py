"""
WebSocket connection manager for real-time chat
"""
from typing import Dict, Set
from fastapi import WebSocket
from datetime import datetime
import json


class ConnectionManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        # Store active connections: {user_id: websocket}
        self.active_connections: Dict[int, WebSocket] = {}
        # Store typing indicators: {user_id: set of users they're typing to}
        self.typing_users: Dict[int, Set[int]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.typing_users[user_id] = set()
        print(f"User {user_id} connected. Active users: {len(self.active_connections)}")
    
    def disconnect(self, user_id: int):
        """Remove a disconnected WebSocket"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.typing_users:
            del self.typing_users[user_id]
        print(f"User {user_id} disconnected. Active users: {len(self.active_connections)}")
    
    def get_online_users(self) -> list:
        """Get list of online user IDs"""
        return list(self.active_connections.keys())
    
    async def send_personal_message(self, user_id: int, message: dict):
        """Send message to specific user"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_json(message)
            except Exception as e:
                print(f"Error sending message to user {user_id}: {e}")
                self.disconnect(user_id)
    
    async def broadcast_online_status(self):
        """Broadcast online users list to all connected users"""
        online_users = self.get_online_users()
        message = {
            "type": "online_users",
            "users": online_users,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for user_id in online_users:
            await self.send_personal_message(user_id, message)
    
    async def send_message(self, sender_id: int, receiver_id: int, content: str, message_id: int):
        """Send private message to receiver"""
        message = {
            "type": "message",
            "id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Send to receiver
        await self.send_personal_message(receiver_id, message)
        
        # Send confirmation to sender
        confirmation = {
            "type": "message_sent",
            "id": message_id,
            "status": "delivered"
        }
        await self.send_personal_message(sender_id, confirmation)
    
    async def send_typing_indicator(self, sender_id: int, receiver_id: int, is_typing: bool):
        """Send typing indicator to receiver"""
        message = {
            "type": "typing",
            "user_id": sender_id,
            "is_typing": is_typing,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.send_personal_message(receiver_id, message)
        
        # Track typing status
        if is_typing:
            if sender_id not in self.typing_users:
                self.typing_users[sender_id] = set()
            self.typing_users[sender_id].add(receiver_id)
        else:
            if sender_id in self.typing_users:
                self.typing_users[sender_id].discard(receiver_id)
    
    async def mark_message_as_seen(self, user_id: int, message_id: int):
        """Notify sender that message was seen"""
        message = {
            "type": "message_seen",
            "id": message_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Message would be sent to sender in actual implementation
        # This is simplified - in production you'd track message ownership
        pass


# Global connection manager instance
manager = ConnectionManager()
