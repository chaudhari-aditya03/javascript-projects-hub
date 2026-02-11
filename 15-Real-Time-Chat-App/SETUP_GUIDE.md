# Real-Time Chat Application - Complete Setup Guide

## Project Overview

A production-ready real-time chat application built with:
- **Backend**: Python FastAPI with WebSocket support, JWT authentication, and SQLAlchemy ORM
- **Frontend**: React with React Router, Axios, and Socket.IO client
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: WebSocket for instant messaging

## Complete Project Structure

```
15-Real-Time-Chat-App/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py              # User, Message models
│   │   ├── schemas.py             # Pydantic validation schemas
│   │   ├── database.py            # Database configuration
│   │   ├── auth.py                # JWT and password utilities
│   │   ├── websocket_manager.py   # WebSocket connection management
│   │   └── routes/
│   │       ├── auth.py            # /auth/register, /auth/login
│   │       ├── users.py           # /users, /users/search, /users/{id}
│   │       └── messages.py        # /messages, /messages/conversation
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── UserList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── hooks/
│   │   │   ├── useSocket.js
│   │   │   └── useAPI.js
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
└── SETUP_GUIDE.md                 # This file
```

## Quick Start (5 Minutes)

### Prerequisites
- Python 3.9+ with pip
- Node.js 16+ with npm
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment file
cp .env.example .env

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment file
cp .env.example .env.local

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Detailed Setup Instructions

### Backend Setup (Detailed)

#### 1. Python Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**What's included:**
- fastapi: Web framework
- uvicorn: ASGI server
- sqlalchemy: ORM
- pydantic: Data validation
- passlib: Password hashing
- pyjwt: JWT tokens
- python-dotenv: Environment config

#### 3. Environment Configuration

Create `.env` file:

```env
# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL=sqlite:///./chat_app.db
# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/chat_db

# JWT Secret (change in production!)
SECRET_KEY=your-super-secret-key-min-32-chars-recommended

# Token expiration (minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS Origins (frontend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173

# Server
HOST=0.0.0.0
PORT=8000
```

#### 4. Database Initialization

Database tables are created automatically on first run.

To reset database:
```bash
# Delete SQLite file
rm chat_app.db

# Tables recreate on server start
```

#### 5. Run Backend Server

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 main:app
```

### Frontend Setup (Detailed)

#### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

#### 2. Environment Configuration

Create `.env.local`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000

# Production example:
# REACT_APP_API_URL=https://api.yourdomain.com
# REACT_APP_WS_URL=wss://api.yourdomain.com
```

#### 3. Development Server

```bash
npm run dev
```

Then open: `http://localhost:5173`

#### 4. Production Build

```bash
npm run build
# Creates optimized build in 'dist' folder

npm run preview
# Test production build locally
```

## API Endpoints Reference

### Authentication

```
POST /auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_online": false,
    "created_at": "2024-01-27T10:00:00"
  }
}
```

```
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register
```

```
GET /auth/me
Authorization: Bearer JWT_TOKEN
```

### Users

```
GET /users
Authorization: Bearer JWT_TOKEN

Response: Array of users with online status

GET /users/search?q=john
Authorization: Bearer JWT_TOKEN

GET /users/online
Authorization: Bearer JWT_TOKEN

Response: [1, 3, 5] - list of online user IDs

GET /users/{user_id}
Authorization: Bearer JWT_TOKEN

GET /users/{user_id}/conversation
Authorization: Bearer JWT_TOKEN

Response: Array of messages in conversation
```

### Messages

```
POST /messages
Authorization: Bearer JWT_TOKEN
{
  "receiver_id": 2,
  "content": "Hello!"
}

GET /messages/conversation/{user_id}
Authorization: Bearer JWT_TOKEN

PUT /messages/{message_id}/seen
Authorization: Bearer JWT_TOKEN
```

### WebSocket

```
WS /ws?token=JWT_TOKEN

Client -> Server:
{
  "type": "message",
  "receiver_id": 2,
  "content": "Hello!"
}

{
  "type": "typing",
  "receiver_id": 2,
  "is_typing": true
}

Server -> Client:
{
  "type": "message",
  "id": 123,
  "sender_id": 1,
  "content": "Hello!",
  "timestamp": "2024-01-27T10:30:00"
}

{
  "type": "online_users",
  "users": [1, 3, 5],
  "timestamp": "2024-01-27T10:30:00"
}
```

## Database Schema

### Users Table
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

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
```

### Messages Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation (sender_id, receiver_id),
    INDEX idx_created_at (created_at)
);
```

## Testing the Application

### Test Account

Create test users manually through the registration page, or use the API:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Flow

1. **Registration**
   - Go to `http://localhost:5173/register`
   - Create two accounts
   
2. **Login**
   - Login with first account
   
3. **Chat**
   - Open second browser/tab
   - Login with second account
   - Select user and send message
   - Message appears in real-time

4. **Features to Test**
   - Online status updates
   - Message sending and receiving
   - Typing indicators
   - Message history
   - User search

## Deployment

### Deploy Backend (Heroku Example)

```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT main:app" > Procfile

# Create runtime.txt
echo "python-3.11.7" > runtime.txt

# Initialize git and deploy
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
heroku config:set SECRET_KEY="your-secret-key"
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Environment Variables for Production

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@db-host:5432/chat_db
SECRET_KEY=your-very-long-secure-random-key-here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ACCESS_TOKEN_EXPIRE_MINUTES=1440
HOST=0.0.0.0
PORT=8000
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com
```

## Troubleshooting

### Backend Issues

**Error: `No module named 'app'`**
- Solution: Ensure you're in the correct directory and running from project root

**Error: `Port 8000 already in use`**
- Solution: Use different port: `uvicorn main:app --port 8001`

**Error: `Database locked`**
- Solution: Use PostgreSQL instead of SQLite for concurrency

**Error: CORS blocked**
- Solution: Update `CORS_ORIGINS` in .env with your frontend URL

### Frontend Issues

**Error: Cannot connect to WebSocket**
- Solution: Ensure backend is running and `REACT_APP_WS_URL` is correct

**Error: 401 Unauthorized**
- Solution: Clear localStorage and login again, check token validity

**Error: Build fails**
- Solution: Run `npm install` again, check Node version is 16+

**Error: Port 5173 already in use**
- Solution: Kill process on port or use `npm run dev -- --port 5174`

### Common Solutions

1. **Restart both servers** - Simple but effective
2. **Clear browser cache** - Especially for development
3. **Check console logs** - Both browser DevTools and terminal
4. **Verify environment variables** - Double-check .env files
5. **Check network tab** - See actual API responses
6. **Use curl for API testing**:
   ```bash
   curl -X GET http://localhost:8000/users \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Performance Optimization

### Backend
- Use PostgreSQL instead of SQLite for production
- Enable connection pooling
- Add Redis for caching
- Implement message pagination
- Use proper database indexes

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minification in production build
- Use CDN for assets
- Implement virtual scrolling for large message lists

## Security Considerations

### Backend
- ✅ Password hashing with bcrypt
- ✅ JWT with expiration
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: HTTPS only in production
- ⚠️ TODO: Implement refresh tokens

### Frontend
- ✅ Protected routes
- ✅ Token storage in localStorage
- ⚠️ TODO: Use httpOnly cookies for better security
- ⚠️ TODO: Implement CSRF protection
- ⚠️ TODO: Add input sanitization

## Next Steps / Future Enhancements

1. **Group Chats**
   - Create chat rooms
   - Multiple users in one chat
   - Group permissions

2. **Message Features**
   - File sharing
   - Image uploads
   - Message reactions
   - Message editing/deletion
   - Message search

3. **Advanced Features**
   - Video/Audio calls
   - End-to-end encryption
   - Message read receipts
   - Last seen timestamps
   - User blocking/muting

4. **Performance**
   - Message pagination
   - Virtual scrolling
   - Lazy loading
   - Caching strategies

5. **Notifications**
   - Push notifications
   - Sound notifications
   - Desktop notifications

6. **Analytics**
   - Message statistics
   - User activity tracking
   - Performance monitoring

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README files in backend/ and frontend/
3. Check browser console and terminal logs
4. Verify all environment variables are set correctly

## License

MIT License - Feel free to use for personal and commercial projects

---

**Last Updated**: January 27, 2024
**Version**: 1.0.0
