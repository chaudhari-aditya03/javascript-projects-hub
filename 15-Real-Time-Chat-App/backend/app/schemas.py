"""
Pydantic schemas for request/response validation
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    """User response schema"""
    id: int
    is_online: bool
    last_seen: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class UserDetailResponse(UserResponse):
    """Detailed user response with message count"""
    pass


class MessageBase(BaseModel):
    """Base message schema"""
    content: str = Field(..., min_length=1, max_length=5000)
    receiver_id: int


class MessageCreate(MessageBase):
    """Message creation schema"""
    pass


class MessageResponse(MessageBase):
    """Message response schema"""
    id: int
    sender_id: int
    is_seen: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationMessage(BaseModel):
    """Message with sender/receiver info"""
    id: int
    sender: UserResponse
    receiver: UserResponse
    content: str
    is_seen: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    """Conversation with latest message"""
    other_user: UserResponse
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TypingIndicator(BaseModel):
    """Typing indicator schema"""
    user_id: int
    receiver_id: int
    is_typing: bool
