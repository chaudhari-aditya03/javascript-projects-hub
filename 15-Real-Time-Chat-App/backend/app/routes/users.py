"""
User management routes: list users, search, status
"""
from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import User, Message
from app.schemas import UserResponse, ConversationResponse
from app.database import get_db
from app.websocket_manager import manager
from app.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
async def list_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all users with online status
    """
    users = db.query(User).filter(User.id != current_user.id).all()
    
    # Update online status based on active connections
    online_user_ids = manager.get_online_users()
    for user in users:
        user.is_online = user.id in online_user_ids
    
    return users


@router.get("/search", response_model=List[UserResponse])
async def search_users(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search users by username or email
    
    - **q**: Search query (username or email)
    """
    users = db.query(User).filter(
        (User.id != current_user.id) & (
            (User.username.ilike(f"%{q}%")) |
            (User.email.ilike(f"%{q}%"))
        )
    ).all()
    
    # Update online status
    online_user_ids = manager.get_online_users()
    for user in users:
        user.is_online = user.id in online_user_ids
    
    return users


@router.get("/online", response_model=List[int])
async def get_online_users(current_user: User = Depends(get_current_user)):
    """
    Get list of online user IDs
    """
    online_users = manager.get_online_users()
    # Exclude current user
    return [uid for uid in online_users if uid != current_user.id]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get specific user details
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update online status
    user.is_online = user.id in manager.get_online_users()
    
    return user


@router.get("/{user_id}/conversation", response_model=List[dict])
async def get_conversation(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get conversation messages between current user and specified user
    
    Returns messages sorted by timestamp
    """
    # Check if user exists
    other_user = db.query(User).filter(User.id == user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get all messages between users
    messages = db.query(Message).filter(
        (
            (Message.sender_id == current_user.id) & (Message.receiver_id == user_id)
        ) | (
            (Message.sender_id == user_id) & (Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at).all()
    
    return [
        {
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "content": msg.content,
            "is_seen": msg.is_seen,
            "created_at": msg.created_at.isoformat()
        }
        for msg in messages
    ]


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all conversations for current user with latest message
    """
    # Get unique users we've messaged
    users_in_conversation = db.query(Message.sender_id, Message.receiver_id).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).all()
    
    # Build unique user set
    user_ids = set()
    for sender_id, receiver_id in users_in_conversation:
        if sender_id == current_user.id:
            user_ids.add(receiver_id)
        else:
            user_ids.add(sender_id)
    
    conversations = []
    for user_id in user_ids:
        other_user = db.query(User).filter(User.id == user_id).first()
        
        # Get last message
        last_msg = db.query(Message).filter(
            (
                (Message.sender_id == current_user.id) & (Message.receiver_id == user_id)
            ) | (
                (Message.sender_id == user_id) & (Message.receiver_id == current_user.id)
            )
        ).order_by(Message.created_at.desc()).first()
        
        # Count unread messages
        unread = db.query(Message).filter(
            (Message.sender_id == user_id) &
            (Message.receiver_id == current_user.id) &
            (Message.is_seen == False)
        ).count()
        
        conversations.append({
            "other_user": other_user,
            "last_message": last_msg.content if last_msg else None,
            "last_message_time": last_msg.created_at if last_msg else None,
            "unread_count": unread
        })
    
    # Sort by last message time
    conversations.sort(
        key=lambda x: x["last_message_time"] or datetime.min,
        reverse=True
    )
    
    return conversations


from datetime import datetime
