# API Examples & Testing Guide

## Using cURL for API Testing

### 1. User Registration

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "is_online": false,
    "last_seen": "2024-01-27T10:00:00",
    "created_at": "2024-01-27T10:00:00"
  }
}
```

### 2. User Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Save token for next requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. List All Users

```bash
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[
  {
    "id": 2,
    "username": "bob",
    "email": "bob@example.com",
    "is_online": true,
    "last_seen": "2024-01-27T10:30:00",
    "created_at": "2024-01-27T10:05:00"
  }
]
```

### 4. Search Users

```bash
curl -X GET "http://localhost:8000/users/search?q=bob" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Online Users

```bash
curl -X GET http://localhost:8000/users/online \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[2, 3]
```

### 6. Get Specific User

```bash
curl -X GET http://localhost:8000/users/2 \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Conversation with User

```bash
curl -X GET http://localhost:8000/users/2/conversation \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hi Bob!",
    "is_seen": true,
    "created_at": "2024-01-27T10:10:00"
  },
  {
    "id": 2,
    "sender_id": 2,
    "receiver_id": 1,
    "content": "Hey Alice!",
    "is_seen": false,
    "created_at": "2024-01-27T10:11:00"
  }
]
```

### 8. Get Current User

```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Send Message (HTTP)

```bash
curl -X POST http://localhost:8000/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiver_id": 2,
    "content": "Hello Bob, how are you?"
  }'
```

**Response:**
```json
{
  "id": 3,
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Hello Bob, how are you?",
  "is_seen": false,
  "created_at": "2024-01-27T10:15:00"
}
```

### 10. Get Messages with User

```bash
curl -X GET http://localhost:8000/messages/conversation/2 \
  -H "Authorization: Bearer $TOKEN"
```

### 11. Mark Message as Seen

```bash
curl -X PUT http://localhost:8000/messages/3/seen \
  -H "Authorization: Bearer $TOKEN"
```

## WebSocket Testing with wscat

Install wscat:
```bash
npm install -g wscat
```

### Connect to WebSocket

```bash
wscat -c "ws://localhost:8000/ws?token=YOUR_JWT_TOKEN"
```

### Send Message

```json
{
  "type": "message",
  "receiver_id": 2,
  "content": "Hello from WebSocket!"
}
```

### Send Typing Indicator

```json
{
  "type": "typing",
  "receiver_id": 2,
  "is_typing": true
}
```

Stop typing:
```json
{
  "type": "typing",
  "receiver_id": 2,
  "is_typing": false
}
```

### Send Ping (Keep-alive)

```json
{
  "type": "ping"
}
```

## Postman Collection

### Setup

1. Create new collection: "Chat API"
2. Add environment variable:
   ```
   base_url = http://localhost:8000
   token = (set after login)
   ```

### Endpoints

#### Register
- Method: POST
- URL: {{base_url}}/auth/register
- Body:
  ```json
  {
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- Tests: Save token to environment
  ```javascript
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.access_token);
  ```

#### Login
- Method: POST
- URL: {{base_url}}/auth/login
- Body:
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- Headers: Content-Type: application/json

#### Get Current User
- Method: GET
- URL: {{base_url}}/auth/me
- Headers: Authorization: Bearer {{token}}

#### List Users
- Method: GET
- URL: {{base_url}}/users
- Headers: Authorization: Bearer {{token}}

#### Search Users
- Method: GET
- URL: {{base_url}}/users/search?q=bob
- Headers: Authorization: Bearer {{token}}

#### Get User
- Method: GET
- URL: {{base_url}}/users/2
- Headers: Authorization: Bearer {{token}}

#### Send Message
- Method: POST
- URL: {{base_url}}/messages
- Headers: 
  - Content-Type: application/json
  - Authorization: Bearer {{token}}
- Body:
  ```json
  {
    "receiver_id": 2,
    "content": "Hello!"
  }
  ```

#### Get Conversation
- Method: GET
- URL: {{base_url}}/messages/conversation/2
- Headers: Authorization: Bearer {{token}}

## Testing Workflow

### 1. Complete Flow Test

```bash
# Terminal 1: Start Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Terminal 3: Test API
TOKEN_ALICE=""
TOKEN_BOB=""

# Register Alice
RESPONSE=$(curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123"
  }')
TOKEN_ALICE=$(echo $RESPONSE | jq -r '.access_token')
echo "Alice Token: $TOKEN_ALICE"

# Register Bob
RESPONSE=$(curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob",
    "email": "bob@example.com",
    "password": "password123"
  }')
TOKEN_BOB=$(echo $RESPONSE | jq -r '.access_token')
echo "Bob Token: $TOKEN_BOB"

# Alice lists users
echo "\n=== Alice lists users ==="
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer $TOKEN_ALICE" | jq

# Bob lists users
echo "\n=== Bob lists users ==="
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer $TOKEN_BOB" | jq

# Alice sends message to Bob
echo "\n=== Alice sends message ==="
curl -X POST http://localhost:8000/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ALICE" \
  -d '{
    "receiver_id": 2,
    "content": "Hi Bob!"
  }' | jq

# Alice gets conversation with Bob
echo "\n=== Conversation between Alice and Bob ==="
curl -X GET http://localhost:8000/messages/conversation/2 \
  -H "Authorization: Bearer $TOKEN_ALICE" | jq
```

### 2. WebSocket Chat Test

```bash
# Terminal 1: Alice connects to WebSocket
wscat -c "ws://localhost:8000/ws?token=$TOKEN_ALICE"

# Terminal 2: Bob connects to WebSocket
wscat -c "ws://localhost:8000/ws?token=$TOKEN_BOB"

# In Terminal 1 (Alice), send:
{"type": "message", "receiver_id": 2, "content": "Hello Bob!"}

# In Terminal 2 (Bob), should receive:
{"type": "message", "id": 1, "sender_id": 1, "receiver_id": 2, "content": "Hello Bob!", "timestamp": "..."}

# In Terminal 2 (Bob), send:
{"type": "typing", "receiver_id": 1, "is_typing": true}

# In Terminal 1 (Alice), should receive:
{"type": "typing", "user_id": 2, "is_typing": true, "timestamp": "..."}
```

### 3. Frontend Manual Testing

1. Open http://localhost:5173
2. Register account (alice@test.com)
3. In another browser/incognito, register (bob@test.com)
4. Login with both accounts
5. Test features:
   - See each other in user list
   - See online status
   - Search for user
   - Send message
   - See real-time delivery
   - Check typing indicator
   - Load conversation history

## Error Test Cases

### 1. Invalid Credentials

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpassword"
  }'
```

Expected: 401 Unauthorized

### 2. Invalid Token

```bash
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer invalidtoken"
```

Expected: 401 Unauthorized

### 3. Duplicate Email

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice2",
    "email": "alice@example.com",
    "password": "password123"
  }'
```

Expected: 400 Bad Request

### 4. Missing Required Field

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "charlie",
    "password": "password123"
  }'
```

Expected: 422 Unprocessable Entity

### 5. User Not Found

```bash
curl -X GET http://localhost:8000/users/99999 \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 404 Not Found

### 6. Send Message to Non-existent User

```bash
curl -X POST http://localhost:8000/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiver_id": 99999,
    "content": "Hello!"
  }'
```

Expected: 404 Not Found

## Performance Testing

### Load Testing with Apache Bench

```bash
# Register many users
for i in {1..100}; do
  curl -X POST http://localhost:8000/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"user$i\",
      \"email\": \"user$i@example.com\",
      \"password\": \"password123\"
    }" &
done
```

### Concurrent Requests

```bash
# Test API with concurrent requests
for i in {1..50}; do
  curl -X GET http://localhost:8000/users \
    -H "Authorization: Bearer $TOKEN" &
done
wait
```

## Checklist for Testing

- [ ] User registration works
- [ ] User login works
- [ ] JWT token is returned
- [ ] Token is required for API access
- [ ] List users endpoint works
- [ ] Search users endpoint works
- [ ] Online status updates
- [ ] Send message (HTTP) works
- [ ] Get conversation works
- [ ] WebSocket connection works
- [ ] Send message via WebSocket
- [ ] Receive message via WebSocket
- [ ] Typing indicator works
- [ ] Online users update works
- [ ] Message history loads
- [ ] Responsive design works
- [ ] Error messages display properly
- [ ] Logout clears token
- [ ] Protected routes redirect to login

---

**Happy Testing!** 🚀
