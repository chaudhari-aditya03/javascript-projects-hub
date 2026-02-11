"""
Message routes: send, retrieve messages
"""
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.models import User, Message
from app.schemas import MessageCreate, MessageResponse
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to another user
    
    - **content**: Message content (1-5000 characters)
    - **receiver_id**: ID of message recipient
    """
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    # Create message
    db_message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=message_data.content
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message


@router.get("/conversation/{user_id}", response_model=List[MessageResponse])
async def get_conversation_messages(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages in conversation with specific user
    
    - **user_id**: ID of the other user in conversation
    """
    # Verify user exists
    other_user = db.query(User).filter(User.id == user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get messages between users
    messages = db.query(Message).filter(
        (
            (Message.sender_id == current_user.id) & (Message.receiver_id == user_id)
        ) | (
            (Message.sender_id == user_id) & (Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at).all()
    
    # Mark received messages as seen
    unseen = db.query(Message).filter(
        (Message.sender_id == user_id) &
        (Message.receiver_id == current_user.id) &
        (Message.is_seen == False)
    ).all()
    
    for msg in unseen:
        msg.is_seen = True
    
    if unseen:
        db.commit()
    
    return messages


@router.put("/{message_id}/seen", status_code=status.HTTP_200_OK)
async def mark_message_as_seen(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a message as seen
    """
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot mark other user's received message"
        )
    
    message.is_seen = True
    db.commit()
    
    return {"status": "ok"}
