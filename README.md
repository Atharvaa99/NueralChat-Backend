# 🤖 NeuralChat - AI Chatbot Backend

A production-grade RESTful API backend for an AI-powered chat application. Users can have multiple conversations with different AI models, with intelligent context management and automatic conversation summarization.

## 🚀 Features

- **Multi-Model AI Support**: Switch between LLaMA 3, Mistral, and Gemma models mid-conversation
- **JWT Authentication**: Secure login/register with HTTP-only cookies
- **Smart Context Management**: Sends last 10 messages to stay within token limits
- **Auto Summarization**: Automatically summarizes conversations every 10 messages for long-term context
- **Auto Chat Titling**: Generates chat titles from the first message 
- **Cascade Delete**: Deleting a chat removes all its messages
- **Multiple Conversations**: Users can maintain separate chat sessions

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **AI Provider**: Groq (LLaMA 3, Mistral, Gemma)
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Atharvaa99/NueralChat-Backend.git
   cd neuralchat-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Server runs on `http://localhost:3000`

## 🧠 How Context Management Works

One of the key features of this backend is intelligent context management:

```
Short conversations (< 10 messages):
  → Send full history to AI

Long conversations (10+ messages):
  → Send summary of earlier messages + last 10 messages
  → Summary updates every 10 messages automatically

Result: AI always has full context without hitting token limits!
```

This mirrors how production AI assistants handle long conversations.

## 📡 API Endpoints

### **Authentication** (Public)

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User Registered successfully"
}
```

---

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "userName": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Logged In successfully"
}
```

---

#### `POST /api/auth/logout`
Logout current user.

**Response:**
```json
{
  "message": "User Logged Out"
}
```

---

### **Chat** (Requires Authentication)

#### `POST /api/chat/new/message`
Start a new conversation. Auto-generates chat title from first message.

**Request Body:**
```json
{
  "prompt": "What is JavaScript?",
  "model": "llama3"
}
```

**Available Models:** `llama3`, `mixtral`, `gemma`

**Response:**
```json
{
  "message": "Response generated successfully",
  "chatId": "abc123",
  "title": "What is JavaScript?...",
  "response": "JavaScript is a high-level programming language..."
}
```

---

#### `POST /api/chat/:chatId/message`
Continue an existing conversation. AI remembers full context.

**Request Body:**
```json
{
  "prompt": "Can you give me an example?",
  "model": "llama3"
}
```

**Response:**
```json
{
  "message": "Response generated successfully",
  "chatId": "abc123",
  "title": "What is JavaScript?...",
  "response": "Sure! Here's a simple example..."
}
```

---

#### `GET /api/chat/all`
Get all chats for the logged-in user (for sidebar display).

**Response:**
```json
{
  "message": "Chats fetched successfully",
  "chats": [
    {
      "_id": "abc123",
      "title": "What is JavaScript?...",
      "createdAt": "2026-02-17T10:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/chat/:chatId/messages`
Get all messages in a specific chat.

**Response:**
```json
{
  "message": "Fetched all prompts successfully",
  "prompts": [
    {
      "_id": "msg123",
      "prompt": "What is JavaScript?",
      "response": "JavaScript is...",
      "model": "llama3",
      "createdAt": "2026-02-17T10:00:00.000Z"
    }
  ]
}
```

---

#### `DELETE /api/chat/:chatId`
Delete a chat and all its messages (cascade delete).

**Response:**
```json
{
  "message": "Chat deleted Successfully"
}
```

---

## 📁 Project Structure

```
neuralchat-backend/
├── src/
│   ├── controller/
│   │   ├── auth.controller.js    # Register, login, logout
│   │   └── chat.controller.js    # Chat & message logic
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification
│   ├── model/
│   │   ├── user.model.js         # User schema
│   │   ├── chat.model.js         # Chat schema (with summary)
│   │   └── prompt-response.model.js # Message schema
│   ├── routes/
│   │   ├── auth.route.js         # Auth endpoints
│   │   └── chat.route.js         # Chat endpoints
│   ├── services/
│   │   └── groq.service.js       # Groq AI integration
│   ├── db/
│   │   └── db.js                 # MongoDB connection
│   └── app.js                    # Express app setup
├── server.js                     # Entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Security Features

- **bcrypt**: Password hashing with 10 salt rounds
- **JWT**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **CORS**: Configured for specific frontend origin
- **Input Validation**: Checks for duplicate users on registration

## 🤖 Supported AI Models

| Model Key | Actual Model | Best For |
|-----------|-------------|----------|
| `llama3` | llama-3.3-70b-versatile | General purpose, best quality |
| `llama3fast` | llama-3.1-8b-instant | Fast responses, high rate limits |
| `qwen` | qwen/qwen-3-32b | Reasoning and complex tasks |

All models are provided free via [Groq](https://groq.com) - no API costs!

## 🚀 Deployment

### **Render (Recommended)**

1. Push code to GitHub
2. Connect repository on [render.com](https://render.com)
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `FRONTEND_URL`
5. Deploy!

**Live API:** `https://nueralchat-backend.onrender.com/`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `GROQ_API_KEY` | Groq API key (free) | ✅ |
| `PORT` | Server port (default: 3000) | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |

## 🧪 Testing the API

### **Recommended Flow:**

```bash
# 1. Register
POST /api/auth/register
{ "userName": "test", "email": "test@test.com", "password": "pass123" }

# 2. Login
POST /api/auth/login
{ "userName": "test", "password": "pass123" }

# 3. Start new chat
POST /api/chat/new/message
{ "prompt": "Hello!", "model": "llama3" }

# 4. Continue chat (use chatId from step 3)
POST /api/chat/:chatId/message
{ "prompt": "Tell me more", "model": "llama3" }

# 5. View all chats
GET /api/chat/all

# 6. View chat history
GET /api/chat/:chatId/messages

# 7. Delete chat
DELETE /api/chat/:chatId
```

## 🔮 Planned Features

- [ ] Streaming responses
- [ ] Image generation support
- [ ] Chat sharing
- [ ] Export chat history
- [ ] Rate limiting
- [ ] User profile management

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

