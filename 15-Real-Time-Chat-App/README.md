# Real-Time Chat Application

A production-ready real-time chat application with JWT authentication, WebSocket support, and a modern responsive UI.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-Time Messaging**: Instant message delivery using WebSockets
- **User Management**: View all users, search users, online status tracking
- **Chat Interface**: Clean, responsive chat UI (WhatsApp-like)
- **Typing Indicators**: See when users are typing
- **Message History**: Load and view conversation history
- **Online Status**: Real-time online/offline status updates
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🛠 Tech Stack

### Backend
- **Python 3.9+** with **FastAPI** - Modern async web framework
- **WebSocket** - Real-time communication
- **SQLAlchemy** - ORM for database
- **JWT** - Secure token authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Responsive styling
- **Vite** - Fast build tool
- **Context API** - State management

### Database
- **SQLite** (development)
- **PostgreSQL** (production ready)

## 📦 Project Structure

```
15-Real-Time-Chat-App/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── websocket_manager.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── users.py
│   │       └── messages.py
│   ├── main.py
│   └── requirements.txt
├── frontend/             # React application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
├── SETUP_GUIDE.md        # Complete setup instructions
├── DOCUMENTATION.md      # Full documentation
├── API_EXAMPLES.md       # API testing examples
└── quickstart.sh         # Quick start script
```

## ⚡ Quick Start

### Option 1: Automated Setup (Linux/macOS)

```bash
bash quickstart.sh
```

### Option 2: Automated Setup (Windows)

```cmd
quickstart.bat
```

### Option 3: Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and configuration
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Full technical documentation
- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - API testing examples with cURL/Postman
- **[backend/README.md](./backend/README.md)** - Backend specific documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend specific documentation

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention via ORM
- WebSocket authentication
- Automatic token expiration

## 🧪 Testing

### cURL Examples
```bash
# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'

# List users
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [API_EXAMPLES.md](./API_EXAMPLES.md) for complete testing guide.

## 📱 User Flow

1. **Register** - Create new account with username, email, password
2. **Login** - Authenticate and receive JWT token
3. **Browse Users** - View all users with online status
4. **Search** - Find users by name or email
5. **Start Chat** - Click user to open chat window
6. **Message** - Send and receive messages in real-time
7. **Logout** - Clear token and return to login

## 🚀 Deployment

### Backend (Heroku, AWS, DigitalOcean)
```bash
# Create Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT main:app" > Procfile

# Deploy
git push heroku main
```

### Frontend (Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#deployment) for detailed deployment instructions.

## 📊 Database Models

### User
- id, username, email, hashed_password
- is_online, last_seen, created_at

### Message
- id, sender_id, receiver_id, content
- is_seen, created_at

## 🔌 WebSocket Events

**Client → Server:**
- `message` - Send private message
- `typing` - Send typing indicator
- `ping` - Keep-alive heartbeat

**Server → Client:**
- `message` - New message received
- `online_users` - Online users list
- `typing` - User typing indicator
- `message_sent` - Delivery confirmation
- `pong` - Keep-alive response

## 🐛 Troubleshooting

**WebSocket won't connect?**
- Ensure backend is running on port 8000
- Check JWT token is valid
- Verify WebSocket URL in frontend .env

**CORS errors?**
- Update CORS_ORIGINS in backend .env with frontend URL

**Messages not loading?**
- Clear browser cache
- Check network tab in DevTools
- Verify database has messages

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for more solutions.

## 📈 Future Enhancements

- Group chat functionality
- File/image sharing
- Message reactions
- Voice/video calls
- End-to-end encryption
- Push notifications
- Read receipts
- Message search

## 📄 License

MIT License - Free to use for personal and commercial projects

## 👨‍💻 Author

Built as a production-ready full-stack chat application example.

## 📞 Support

For detailed help, refer to:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup issues
- [DOCUMENTATION.md](./DOCUMENTATION.md) for technical details
- [API_EXAMPLES.md](./API_EXAMPLES.md) for API testing
- Individual README files in backend/ and frontend/ directories

---

**Version**: 1.0.0  
**Last Updated**: January 27, 2024

**Happy Coding! 🚀💬**
