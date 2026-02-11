# Frontend - Real-Time Chat Application

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Login form component
│   │   ├── Register.jsx           # Registration form component
│   │   ├── Header.jsx             # Navigation header with user menu
│   │   ├── UserList.jsx           # User list with search
│   │   ├── ChatWindow.jsx         # Chat interface with messages
│   │   ├── Chat.jsx               # Main chat page
│   │   └── ProtectedRoute.jsx     # Route protection for auth
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state management
│   │   └── ChatContext.jsx        # Chat state management
│   ├── services/
│   │   ├── api.js                 # HTTP API calls
│   │   └── socket.js              # WebSocket client
│   ├── hooks/
│   │   ├── useSocket.js           # WebSocket hook
│   │   └── useAPI.js              # API hook
│   ├── App.jsx                    # Main app component
│   ├── index.jsx                  # React entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── package.json                   # Dependencies
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and update:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)
- `REACT_APP_WS_URL`: WebSocket URL (default: ws://localhost:8000)

### 3. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Features Implemented

### Authentication
- User registration with validation
- User login with JWT tokens
- Automatic token persistence in localStorage
- Token-based API authentication
- Protected routes for authenticated users

### User Management
- List all users with online status
- Search users by username or email
- Real-time online/offline status updates
- User profile information

### Real-Time Chat
- WebSocket connection with JWT authentication
- One-to-one private messaging
- Automatic message loading from conversation history
- Real-time message delivery
- Typing indicators
- Message timestamps

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean and modern interface using Tailwind CSS
- Real-time status updates
- Toast notifications for errors
- Loading states
- User-friendly error messages

## Component Details

### Login (Login.jsx)
- Email and password input
- Form validation
- Error handling
- Link to registration page
- Demo credentials display

### Register (Register.jsx)
- Username, email, password inputs
- Password confirmation
- Input validation
- Error handling
- Link to login page

### Header (Header.jsx)
- User avatar and name
- User menu with logout
- Responsive layout

### UserList (UserList.jsx)
- Search users by name/email
- Display user status (online/offline)
- User selection
- Loading and error states

### ChatWindow (ChatWindow.jsx)
- Load conversation history
- Display messages with timestamps
- Send messages with validation
- Typing indicator
- Auto-scroll on new messages
- Empty state

### Chat (Chat.jsx)
- Main chat page layout
- WebSocket connection management
- Message synchronization
- Online users tracking
- Responsive two-column layout

### ProtectedRoute (ProtectedRoute.jsx)
- Route protection for authenticated users
- Redirect to login if not authenticated
- Loading state during auth check

## API Integration

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### User Endpoints
- `GET /users` - List all users
- `GET /users/search?q=term` - Search users
- `GET /users/online` - Get online users
- `GET /users/{id}` - Get user profile
- `GET /users/{id}/conversation` - Get conversation

### Message Endpoints
- `POST /messages` - Send message
- `GET /messages/conversation/{user_id}` - Get messages
- `PUT /messages/{id}/seen` - Mark as seen

### WebSocket Events
- `connect` - Connection established
- `message` - New message received
- `typing` - Typing indicator
- `online_users` - Online users list update
- `disconnect` - Connection closed

## State Management

### AuthContext
- `user` - Current user object
- `token` - JWT access token
- `isAuthenticated` - Auth status
- `login()` - Login function
- `logout()` - Logout function

### ChatContext
- `messages` - All messages by user ID
- `selectedUser` - Currently selected user
- `onlineUsers` - List of online user IDs
- `typing` - Typing status by user ID
- `addMessage()` - Add message to state
- `updateOnlineUsers()` - Update online users list

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

### Deploy to GitHub Pages

1. Update `vite.config.js`:
```js
export default {
  base: '/repo-name/',
  ...
}
```

2. Build and deploy:
```bash
npm run build
# Push dist folder to gh-pages branch
```

## Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000

# For production, use HTTPS/WSS:
# REACT_APP_API_URL=https://api.yourdomain.com
# REACT_APP_WS_URL=wss://api.yourdomain.com
```

## Troubleshooting

**Issue**: Cannot connect to WebSocket
**Solution**: Ensure backend is running and WebSocket URL is correct in .env.local

**Issue**: 401 Unauthorized errors
**Solution**: Check that token is valid and token storage is working

**Issue**: CORS errors
**Solution**: Ensure backend CORS_ORIGINS includes your frontend URL

**Issue**: Messages not loading
**Solution**: Check network tab in DevTools, verify API endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Use production build for deployment (`npm run build`)
- Enable gzip compression on your hosting
- Use a CDN for static assets
- Implement message pagination for large conversations
- Optimize images and assets

## Security Notes

- JWT tokens are stored in localStorage (vulnerable to XSS)
- For better security, use httpOnly cookies
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting on backend
- Add CSRF protection if needed
