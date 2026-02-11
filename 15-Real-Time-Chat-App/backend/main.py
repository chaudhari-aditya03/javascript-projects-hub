"""
Main FastAPI application with WebSocket support
"""
import os
from fastapi import FastAPI, WebSocket, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import init_db, get_db
from app.models import User, Message
from app.auth import verify_token_websocket
from app.websocket_manager import manager
from app.routes import auth, users, messages
import json
from datetime import datetime

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Real-Time Chat API",
    description="Production-ready real-time chat application with WebSocket support",
    version="1.0.0"
)

# CORS middleware
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(messages.router)


@app.get("/", tags=["health"])
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Real-Time Chat API is running",
        "version": "1.0.0"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time chat
    
    Query Parameters:
    - token: JWT access token
    
    Message Types (Client -> Server):
    1. message: {"type": "message", "receiver_id": int, "content": str}
    2. typing: {"type": "typing", "receiver_id": int, "is_typing": bool}
    
    Message Types (Server -> Client):
    1. message: {"type": "message", "id": int, "sender_id": int, "content": str, "timestamp": str}
    2. online_users: {"type": "online_users", "users": list[int], "timestamp": str}
    3. typing: {"type": "typing", "user_id": int, "is_typing": bool, "timestamp": str}
    4. message_sent: {"type": "message_sent", "id": int, "status": "delivered"}
    """
    # Verify token
    user_id = verify_token_websocket(token)
    if user_id is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Connect user
    await manager.connect(websocket, user_id)
    user.is_online = True
    db.commit()
    
    # Broadcast online users
    await manager.broadcast_online_status()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            message_type = message_data.get("type")
            
            if message_type == "message":
                # Handle chat message
                receiver_id = message_data.get("receiver_id")
                content = message_data.get("content", "").strip()
                
                if not content or not receiver_id:
                    continue
                
                # Check receiver exists
                receiver = db.query(User).filter(User.id == receiver_id).first()
                if not receiver:
                    error_msg = {
                        "type": "error",
                        "message": "Receiver not found"
                    }
                    await manager.send_personal_message(user_id, error_msg)
                    continue
                
                # Save to database
                db_message = Message(
                    sender_id=user_id,
                    receiver_id=receiver_id,
                    content=content
                )
                db.add(db_message)
                db.commit()
                db.refresh(db_message)
                
                # Send to receiver
                await manager.send_message(
                    user_id,
                    receiver_id,
                    content,
                    db_message.id
                )
            
            elif message_type == "typing":
                # Handle typing indicator
                receiver_id = message_data.get("receiver_id")
                is_typing = message_data.get("is_typing", False)
                
                if receiver_id:
                    await manager.send_typing_indicator(
                        user_id,
                        receiver_id,
                        is_typing
                    )
            
            elif message_type == "ping":
                # Keep-alive ping
                pong = {
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send_personal_message(user_id, pong)
    
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
    
    finally:
        # Disconnect user
        manager.disconnect(user_id)
        user.is_online = False
        user.last_seen = datetime.utcnow()
        db.commit()
        
        # Broadcast online users
        await manager.broadcast_online_status()
