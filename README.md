# LinkSync 💬

 Live Demo: LinkSync — https://linksync-rho.vercel.app/

> A real-time full-stack chat application built with React, Node.js, Express, MongoDB, and Socket.IO.

LinkSync is a full-stack real-time messaging application designed to provide a modern chat experience with user authentication, one-to-one messaging, group conversations, online presence, profile management, file sharing, and real-time communication.

The project was built to understand how a complete full-stack application works — from the React user interface to REST APIs, database operations, authentication, file uploads, and real-time communication using WebSockets.

---

## 📸 Overview

LinkSync provides a complete messaging experience where users can:

- Create an account
- Log in securely
- Manage their profile
- Upload a profile picture
- Search for users
- Start one-to-one conversations
- Send and receive messages in real time
- See online users
- Create groups
- Add members to groups
- View group information
- View group members and administrators
- Share files/images through conversations
- See the latest message preview for conversations
- Search and filter users and groups
- Manage their profile information

The application uses **REST APIs for persistent data operations** and **Socket.IO for real-time communication**.

---

# ✨ Features

## 🔐 Authentication

LinkSync provides basic user authentication.

Users can:

- Create a new account
- Log in using their credentials
- Access their account-specific data
- Maintain a persistent user identity throughout the application

Authentication-related data is handled by the backend rather than directly by the frontend.

---

## 👤 User Profiles

Every user has a profile containing information such as:

- Name
- Username
- Email
- Profile picture
- Bio
- Date of birth
- Country
- State

Users can update their profile information through the profile interface.

### Profile Picture

Users can upload a profile picture using the profile settings.

The backend processes uploaded files using **Multer**, while the resulting image path is stored with the user's profile information.

---

# 💬 One-to-One Messaging

The main feature of LinkSync is real-time messaging.

Users can:

- Select another user
- Open a conversation
- Send messages
- Receive messages in real time
- View previous messages
- See the latest message preview in the contact list

Messages are persisted in MongoDB so that conversations remain available after refreshing the application.

---

# ⚡ Real-Time Communication

LinkSync uses **Socket.IO** for real-time communication.

Instead of repeatedly requesting the server to check for new messages, the client establishes a persistent WebSocket connection.

The basic flow is:

```text
User A
   │
   │ Sends message
   ▼
React Client
   │
   │ Socket.IO
   ▼
Node.js Server
   │
   ├── Save message
   │      │
   │      ▼
   │   MongoDB
   │
   └── Emit message
          │
          ▼
       User B
```

This allows messages to appear without manually refreshing the page.

---

# 🟢 Online Presence

LinkSync maintains an online-user state using Socket.IO.

When a user connects:

```text
Client → Socket.IO Server
             ↓
       User becomes online
```

When the user disconnects:

```text
Client disconnects
        ↓
Socket.IO detects disconnect
        ↓
User removed from online users
```

The frontend uses this information to visually indicate which users are currently online.

---

# 👥 Group Chats

LinkSync supports group conversations.

Users can:

- Create groups
- Give a group a name
- Add members
- View group information
- View group members
- View administrators
- View the group creator
- Send messages inside groups

The group interface contains information such as:

```text
Group Name
Group Picture
Members
Administrators
Created By
```

---

# 🔎 Search

The contact interface includes search functionality.

Users can search between:

- Users
- Groups

The search interface allows the user to switch between different search types.

For example:

```text
Search: john

Users
 ├── john123
 ├── john_doe
 └── johnsmith
```

or:

```text
Groups
 ├── College Friends
 ├── Web Developers
 └── Project Team
```

The contact list also limits the number of displayed search results to keep the interface clean.

---

# 📨 Latest Message Preview

The contacts list displays the latest message from each conversation.

For example:

```text
John
Hey, are you free today?

Sarah
Let's work on the project.
```

The frontend processes the available messages and determines the most recent message associated with each conversation.

This allows users to quickly see the latest activity without opening every conversation.

---

# 📎 File Sharing

LinkSync supports sending files through conversations.

The backend uses **Multer** to process multipart/form-data uploads.

The general upload flow is:

```text
User selects file
       ↓
React creates FormData
       ↓
Request sent to backend
       ↓
Multer processes file
       ↓
File stored on server
       ↓
File path saved with message
       ↓
Recipient receives message
```

Messages can therefore contain both text and file information.

---

# 🌓 Modern UI

The application uses a dark-themed interface with a consistent color palette.

Main UI colors are based around:

```css
--dark: #182A2D;
--panel: #23393D;
--accent: #4E7B80;
--light: #F7F8F0;
```

The interface is divided into several major areas:

```text
┌──────────────────────────────────────────────────────┐
│                      Main Window                     │
├──────────────┬───────────────────────┬───────────────┤
│              │                       │               │
│   Sidebar    │     Chat Window       │ Profile Panel │
│              │                       │               │
│ Contacts     │                       │ User / Group  │
│ Groups       │       Messages        │ Information   │
│ Search       │                       │               │
│              │                       │               │
├──────────────┴───────────────────────┴───────────────┤
│                   Message Composer                    │
└──────────────────────────────────────────────────────┘
```

---

# 🏗️ Project Architecture

LinkSync follows a client-server architecture.

```text
                         LinkSync
                            │
             ┌──────────────┴──────────────┐
             │                             │
        React Frontend                Node Backend
             │                             │
             │ REST API                    │
             ├────────────────────────────►│
             │                             │
             │ Socket.IO                   │
             ├────────────────────────────►│
             │                             │
             │                             ▼
             │                          MongoDB
             │
             ▼
          Browser
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend development/build tool |
| JavaScript | Application logic |
| CSS | Styling |
| Socket.IO Client | Real-time communication |

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| Socket.IO | Real-time communication |
| Mongoose | MongoDB ODM |
| Multer | File uploads |
| CORS | Cross-origin communication |
| dotenv | Environment configuration |

---

## Database

### MongoDB

MongoDB is used as the primary database.

Mongoose is used to define schemas and interact with MongoDB.

Main collections include:

```text
Users
Messages
Groups
```

---

# 📁 Project Structure

A simplified version of the project structure is:

```text
LinkSync/
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── ContactsList/
│   │   │   ├── ChatWindow/
│   │   │   └── ProfilePanel/
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage/
│   │   │   ├── SignUp/
│   │   │   └── MainWindow/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── handleHome.js
│   │   ├── handleProfile.js
│   │   └── handleGroup.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── msgModel.js
│   │   └── groupModel.js
│   │
│   ├── routes/
│   │   ├── homeRoutes.js
│   │   ├── profileRoutes.js
│   │   └── groupRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── db/
│   │   └── connectDB.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

> The exact directory structure may vary depending on the current version of the project.

---

# 🗄️ Database Design

## User Model

The user model contains information about each registered user.

Conceptually:

```javascript
{
    name,
    email,
    pass,
    profilePic,
    username,
    bio,
    dob,
    country,
    state
}
```

The username is unique so that two users cannot register the same username.

---

# 💬 Message Model

Messages contain information about the sender, receiver, content, and optional files.

Conceptually:

```javascript
{
    sender,
    to,
    text,
    file,
    timestamps
}
```

The `sender` references the user who sent the message.

The `to` field references the recipient.

Mongoose references are used to connect messages with users.

---

# 👥 Group Model

Groups contain information about the group and its members.

Conceptually:

```javascript
{
    grpName,
    grpPic,
    members,
    createdBy
}
```

The members array stores references to users participating in the group.

---

# 🔌 REST API

The backend exposes REST endpoints for different application features.

## Home APIs

### Get Users

```http
GET /api/home/getusers
```

Returns users that can be displayed in the contact list.

---

### Get Current User

```http
GET /api/home/me
```

Returns information about the currently logged-in user.

---

### Get Messages

```http
GET /api/home/messages/:id
```

Retrieves the conversation associated with a particular user.

Example:

```http
GET /api/home/messages/USER_ID
```

---

# 👥 Group APIs

### Get Groups

```http
GET /api/group/getGroups
```

Returns groups available to the user.

---

### Create Group

```http
POST /api/group/createGroup
```

Creates a new group.

The request contains information such as:

```text
Group name
Members
Group picture
```

---

# 👤 Profile APIs

The profile system provides endpoints for retrieving and updating user information.

Typical operations include:

```text
Get profile
Update profile
Upload profile picture
```

---

# 🔄 Message Flow

When a user sends a message, the process is approximately:

```text
                    User A
                      │
                      │ Type message
                      ▼
               Message Composer
                      │
                      ▼
                React Client
                      │
                      │ socket.emit()
                      ▼
                 Socket.IO
                      │
                      ▼
                Node Server
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
          MongoDB          Socket.IO
          save message        emit
                                │
                                ▼
                              User B
```

This allows the application to provide real-time communication while also keeping messages persistent.

---

# 🔌 Socket.IO Events

The application uses Socket.IO events to communicate between connected clients and the server.

A simplified message event looks like:

```javascript
socket.emit("message", message);
```

The server receives the event:

```javascript
socket.on("message", async (message) => {
    // Save message
    // Find recipient
    // Emit message
});
```

The server can then forward the message to the intended recipient.

---

# 🌐 CORS Configuration

During development, the frontend and backend run on different ports.

For example:

```text
Frontend
http://localhost:5173

Backend
http://localhost:8000
```

Because these are different origins, CORS needs to be configured.

The backend allows requests from the frontend origin.

Example:

```javascript
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
```

---

# ⚙️ Environment Variables

Sensitive or environment-specific configuration should be stored in `.env`.

Example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

Do not commit sensitive credentials to GitHub.

Add the following to `.gitignore`:

```text
.env
node_modules/
uploads/
```

---

# 🚀 Installation

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

You can verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

---

# 📥 Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd LinkSync
```

---

# 🎨 Frontend Setup

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend should normally be available at:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Open another terminal.

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

or, if a development script is configured:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:8000
```

---

# 🗃️ MongoDB Setup

LinkSync requires MongoDB for persistent storage.

You can use either:

### Local MongoDB

Install MongoDB locally and run the MongoDB service.

Example connection:

```env
MONGO_URI=mongodb://127.0.0.1:27017/linksync
```

### MongoDB Atlas

Alternatively, create a MongoDB Atlas cluster and use its connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/linksync
```

Make sure your database credentials are not committed to the repository.

---

# ▶️ Running the Complete Application

You need both frontend and backend running.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🧪 Testing the Application

A basic testing flow is:

### 1. Create User A

Register the first account.

### 2. Create User B

Register another account using a second account/browser.

### 3. Search for User B

From User A's contact list, search for User B.

### 4. Start Conversation

Select User B and open the chat.

### 5. Send a Message

Send a message from User A.

### 6. Check Real-Time Delivery

Open User B's session and verify that the message appears without refreshing.

### 7. Refresh

Refresh the page and verify that the previous message is retrieved from MongoDB.

### 8. Test Online Status

Close one browser/session and verify that the corresponding user's online status changes.

### 9. Test Groups

Create a group and add multiple users.

### 10. Test Profile

Update profile information and profile picture.

---

# 🧠 What This Project Demonstrates

LinkSync covers several important full-stack development concepts.

## Frontend

- React components
- Component composition
- Props
- State management
- `useState`
- `useEffect`
- `useMemo`
- Conditional rendering
- Array mapping/filtering
- Form handling
- API requests
- File uploads
- Responsive UI
- Component-based architecture

---

## Backend

- Node.js
- Express
- REST APIs
- Routing
- Controllers
- Middleware
- CORS
- Error handling
- File uploads
- Environment variables
- Database operations

---

## Database

- MongoDB
- Mongoose
- Schemas
- Models
- ObjectId references
- CRUD operations
- Relationships between collections

---

## Real-Time Systems

- WebSockets
- Socket.IO
- Socket connections
- Events
- Broadcasting
- Online presence
- Real-time message delivery

---

# 🧩 Design Decisions

## Why React?

React provides a component-based architecture that makes it easier to divide the application into reusable UI sections.

For example:

```text
MainWindow
│
├── Sidebar
├── ContactsList
├── ChatWindow
└── ProfilePanel
```

Each component handles a specific part of the interface.

---

## Why Node.js?

Node.js allows JavaScript to be used on the backend.

This also makes it convenient to share concepts and syntax between the frontend and backend.

---

## Why Express?

Express provides a lightweight way to build REST APIs and organize backend routes and middleware.

---

## Why MongoDB?

Chat applications deal with frequently changing and document-oriented data such as:

- Users
- Messages
- Groups
- Profiles

MongoDB's document model works naturally with this type of data.

---

## Why Socket.IO?

Normal HTTP requests are not ideal for instant message delivery.

With Socket.IO:

```text
Client A
   │
   │ Message
   ▼
Server
   │
   │ Real-time event
   ▼
Client B
```

The recipient can receive a message immediately without polling the server repeatedly.

---

# 🔐 Security Considerations

The current project is primarily a learning project, but a production application should include additional security measures.

Recommended improvements include:

- Password hashing using bcrypt/Argon2
- JWT or session-based authentication
- HTTP-only cookies
- Input validation
- Request rate limiting
- Strong CORS configuration
- File type validation
- File size limits
- Secure file storage
- Authorization checks
- Protection against NoSQL injection
- XSS protection
- CSRF protection where applicable
- Secure environment-variable handling

---

# 🚧 Current Limitations

Some parts of the application can be further improved for production use.

Potential improvements include:

- Stronger authentication
- Password hashing
- JWT/session management
- Message read receipts
- Typing indicators
- Message reactions
- Message editing
- Message deletion
- Message search
- Pagination
- Infinite scrolling
- Better file storage
- Image compression
- Cloud storage
- Push notifications
- Better group permissions
- Message encryption
- Improved error handling
- Automated tests
- Deployment configuration

---

# 🔮 Future Improvements

Possible future versions of LinkSync could include:

### 💬 Messaging

- Message reactions
- Reply to messages
- Edit messages
- Delete messages
- Forward messages
- Reply previews
- Voice messages
- Emoji picker
- Typing indicators

### 👥 Groups

- Group administrators
- Promote/demote members
- Remove members
- Leave group
- Group invitations
- Group permissions

### 🔔 Notifications

- Browser notifications
- Unread message counters
- Sound notifications
- Push notifications

### ☁️ Storage

Move uploaded files from local storage to services such as:

- Cloudinary
- Amazon S3
- Cloudflare R2

### 📱 Mobile

Create a mobile version using:

- React Native
- Expo

---

# 📊 High-Level Data Flow

```text
                         ┌─────────────┐
                         │   Browser   │
                         │    React    │
                         └──────┬──────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
              REST API                    Socket.IO
                  │                           │
                  └─────────────┬─────────────┘
                                │
                         ┌──────▼──────┐
                         │   Express   │
                         │   Server    │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
               Controllers              Socket
                    │                   Handlers
                    │                       │
                    └───────────┬───────────┘
                                │
                         ┌──────▼──────┐
                         │  Mongoose   │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │   MongoDB   │
                         └─────────────┘
```

---

# 🧑‍💻 Development Philosophy

LinkSync was developed as a hands-on full-stack project to understand how individual technologies work together rather than treating the frontend and backend as isolated systems.

The project focuses on understanding:

```text
Frontend
   ↓
HTTP / WebSocket
   ↓
Backend
   ↓
Business Logic
   ↓
Database
   ↓
Response
   ↓
Frontend
```

This architecture provides practical experience with the complete lifecycle of data inside a modern web application.

---

# 🐛 Common Development Issues

## CORS Error

If the frontend cannot communicate with the backend, check:

```text
Frontend origin
Backend CORS configuration
Backend port
API URL
```

For example:

```javascript
origin: "http://localhost:5173"
```

---

## MongoDB Connection Error

Check:

```env
MONGO_URI=...
```

Make sure:

- MongoDB is running
- The connection string is correct
- Atlas network access is configured if using MongoDB Atlas
- Username/password are correct

---

## Socket.IO Connection Error

Verify that the backend Socket.IO server is running and that the frontend connects to the correct URL.

Example:

```javascript
io("http://localhost:8000")
```

---

## File Upload Problems

For file uploads, the frontend request should use:

```text
multipart/form-data
```

rather than sending the file as normal JSON.

The backend should use Multer middleware to process the uploaded file.

---

# 📜 License

This project is intended primarily for learning and educational purposes.

If you plan to distribute or deploy the project publicly, add an appropriate license such as MIT after confirming that all included code/assets permit it.

---

# 👨‍💻 Author

**Rajnish Mittal**

Full-Stack Developer in progress 🚀

Currently exploring:

- React
- Node.js
- Express
- MongoDB
- Socket.IO
- Machine Learning
- Data Science
- Data Structures & Algorithms

---

# ⭐ Project Goal

The main goal of LinkSync is to build a complete real-time communication system while gaining practical experience with full-stack development.

The project brings together:

```text
React
+
Node.js
+
Express
+
MongoDB
+
Mongoose
+
Socket.IO
+
Multer
=
LinkSync 💬
```

---

## 🚀 Future Vision

LinkSync can evolve from a learning project into a production-grade communication platform by adding stronger authentication, scalable real-time infrastructure, cloud file storage, notifications, message encryption, automated testing, and deployment infrastructure.

The current implementation provides the foundation for experimenting with these concepts and progressively expanding the application.
