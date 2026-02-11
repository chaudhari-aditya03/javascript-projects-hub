# Backend - Real-Time Chat Application

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── models.py              # SQLAlchemy ORM models (User, Message)
│   ├── schemas.py             # Pydantic request/response models
│   ├── database.py            # Database configuration and session
│   ├── auth.py                # JWT and password utilities
│   ├── websocket_manager.py   # WebSocket connection management
│   └── routes/
│       ├── auth.py            # Registration, login endpoints
│       ├── users.py           # User listing, search, profile endpoints
│       └── messages.py        # Message sending, retrieval endpoints
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL`: Connection string for your database
- `SECRET_KEY`: Strong random key for JWT signing
- `CORS_ORIGINS`: Frontend URLs allowed to access API

### 4. Initialize Database

The database tables will be created automatically when the server starts.

### 5. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile

### Users

- `GET /users` - List all users with online status
- `GET /users/search?q=term` - Search users by username/email
- `GET /users/online` - Get list of online user IDs
- `GET /users/{user_id}` - Get specific user details
- `GET /users/{user_id}/conversation` - Get conversation with user
- `GET /users/conversations` - Get all conversations

### Messages

- `POST /messages` - Send a message
- `GET /messages/conversation/{user_id}` - Get conversation messages
- `PUT /messages/{message_id}/seen` - Mark message as seen

### WebSocket

- `WS /ws?token=JWT_TOKEN` - Real-time chat connection

## Database Models

### User Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Message Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation (sender_id, receiver_id)
);
```

## Key Features

### 1. JWT Authentication
- User registration with password hashing (bcrypt)
- Login with JWT token generation
- Protected routes using Bearer token
- Token verification for WebSocket connections

### 2. User Management
- List users with online/offline status
- Search users by username or email
- Real-time online status tracking
- User profile endpoints

### 3. Real-Time Chat
- WebSocket connection with JWT validation
- One-to-one private messaging
- Message persistence in database
- Typing indicators
- Message delivery confirmation
- Message "seen" status tracking

### 4. Error Handling
- Comprehensive HTTP status codes
- Detailed error messages
- WebSocket error handling with graceful disconnection
- Database transaction management

## WebSocket Protocol

### Client -> Server Messages

**Send Message:**
```json
{
    "type": "message",
    "receiver_id": 2,
    "content": "Hello!"
}
```

**Typing Indicator:**
```json
{
    "type": "typing",
    "receiver_id": 2,
    "is_typing": true
}
```

**Ping (Keep-alive):**
```json
{
    "type": "ping"
}
```

### Server -> Client Messages

**Incoming Message:**
```json
{
    "type": "message",
    "id": 123,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hello!",
    "timestamp": "2024-01-27T10:30:00"
}
```

**Online Users List:**
```json
{
    "type": "online_users",
    "users": [1, 3, 5],
    "timestamp": "2024-01-27T10:30:00"
}
```

**Typing Indicator:**
```json
{
    "type": "typing",
    "user_id": 1,
    "is_typing": true,
    "timestamp": "2024-01-27T10:30:00"
}
```

**Message Delivered:**
```json
{
    "type": "message_sent",
    "id": 123,
    "status": "delivered"
}
```

**Pong (Keep-alive response):**
```json
{
    "type": "pong",
    "timestamp": "2024-01-27T10:30:00"
}
```

## Deployment

### Using Uvicorn with Gunicorn (Production)

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 main:app
```

### Using Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@db-host:5432/chat_db
SECRET_KEY=your-very-long-random-secret-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
HOST=0.0.0.0
PORT=8000
```

## Security Considerations

1. **Password Hashing**: Uses bcrypt with salt
2. **JWT Tokens**: HS256 algorithm with 24-hour expiration
3. **CORS**: Configurable allowed origins
4. **WebSocket Authentication**: JWT validation before connection
5. **SQL Injection**: Uses SQLAlchemy ORM with parameterized queries
6. **Input Validation**: Pydantic models validate all inputs

## Database Selection

- **SQLite** (default): Good for development/testing
- **PostgreSQL**: Recommended for production (better concurrency)
- **MySQL**: Alternative for production

Update `DATABASE_URL` in `.env` for different databases.

## Troubleshooting

**Issue**: ModuleNotFoundError
**Solution**: Ensure virtual environment is activated and dependencies installed

**Issue**: Database locked (SQLite)
**Solution**: Use PostgreSQL for multi-concurrent connections

**Issue**: WebSocket connection refused
**Solution**: Check JWT token validity and CORS origins

**Issue**: CORS errors
**Solution**: Update CORS_ORIGINS in .env with your frontend URL
