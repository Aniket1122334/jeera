require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db-connection");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const messageModel = require("./models/messageModel");

// Routes
const authRoute = require("./routes/authRoutes/authRoutes");
const orgRoute = require("./routes/orgRoutes/orgRoutes");
const adminRoute = require("./routes/adminRoutes/adminRoutes");
const employeeRoute = require("./routes/employeeRoutes/employeeRoutes");
const analyticsRoute = require("./routes/analyticsRoutes/analyticsRoutes");
const chatRoute = require("./routes/chatRoutes/chatRoutes");

const app = express();
const server = http.createServer(app);

// =========================================================
// CORS CONFIGURATION
// =========================================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://jeera-sigma.vercel.app",
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

// =========================================================
// SOCKET.IO
// =========================================================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// =========================================================
// CHAT ROOM
// =========================================================

const getRoomId = (user1, user2) => {
  return [String(user1), String(user2)].sort().join("_");
};

const getUserRoom = (userId) => `user:${String(userId)}`;

// =========================================================
// ONLINE USERS
// userId -> Set of socket IDs
// Supports multiple tabs and devices.
// =========================================================

const onlineUsers = new Map();

// =========================================================
// SOCKET CONNECTION
// =========================================================

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // -------------------------------------------------------
  // REGISTER USER
  // -------------------------------------------------------

  socket.on("register-user", (payload = {}) => {
    const { userId } = payload;

    if (!userId) return;

    const id = String(userId);

    if (!onlineUsers.has(id)) {
      onlineUsers.set(id, new Set());
    }

    const userSockets = onlineUsers.get(id);
    const wasOffline = userSockets.size === 0;

    userSockets.add(socket.id);

    // Save registered user on this socket.
    socket.userId = id;

    // Room for private user notifications.
    socket.join(getUserRoom(id));

    // Send the current online-user snapshot to all clients.
    const onlineUserIds = [...onlineUsers.keys()];
    io.emit("online-users", onlineUserIds);

    if (wasOffline) {
      io.emit("user-status", {
        userId: id,
        isOnline: true,
      });
    }

    console.log("User registered:", id);
  });

  // -------------------------------------------------------
  // JOIN CHAT ROOM
  // -------------------------------------------------------

  socket.on("join-chat", (payload = {}) => {
    const { sender, receiver } = payload;

    if (!socket.userId || !sender || !receiver) return;

    // Prevent a client from joining a conversation as another user.
    if (String(sender) !== socket.userId) return;

    const roomId = getRoomId(sender, receiver);

    socket.join(roomId);
  });

  // -------------------------------------------------------
  // SEND MESSAGE
  // -------------------------------------------------------

  socket.on("send-msg", async (data = {}) => {
    try {
      const { sender, receiver, content, organisationId } = data;

      if (!socket.userId) {
        socket.emit("message-error", {
          message: "Please reconnect before sending a message",
        });
        return;
      }

      if (!sender || !receiver || !content?.trim()) {
        socket.emit("message-error", {
          message: "Sender, receiver and message are required",
        });
        return;
      }

      // Sender must match the registered socket user.
      if (String(sender) !== socket.userId) {
        socket.emit("message-error", {
          message: "Sender verification failed",
        });
        return;
      }

      if (String(sender) === String(receiver)) {
        socket.emit("message-error", {
          message: "You cannot send a message to yourself",
        });
        return;
      }

      if (!organisationId) {
        socket.emit("message-error", {
          message: "Organisation information is missing",
        });
        return;
      }

      // Save the message in MongoDB.
      const savedMessage = await messageModel.create({
        senderId: sender,
        receiverId: receiver,
        organisationId,
        message: content.trim(),
        isRead: false,
      });

      const roomId = getRoomId(sender, receiver);

      // Deliver to both users in the active conversation.
      io.to(roomId).emit("rec-msg", savedMessage);

      // Notify the receiver's connected tabs for unread badges.
      io.to(getUserRoom(receiver)).emit("new-message", savedMessage);

      // Refresh unread counts on clients.
      io.to(getUserRoom(receiver)).emit("unread-count-updated");

      console.log("Message saved:", savedMessage._id);
    } catch (error) {
      console.error("Send message error:", error);

      socket.emit("message-error", {
        message: "Failed to send message",
      });
    }
  });

  // -------------------------------------------------------
  // MARK MESSAGES AS READ
  // The registered socket user is the receiver.
  // -------------------------------------------------------

  socket.on("mark-read", async (payload = {}) => {
    try {
      const receiverId = socket.userId;
      const { senderId } = payload;

      if (!receiverId || !senderId) return;

      await messageModel.updateMany(
        {
          senderId,
          receiverId,
          isRead: false,
        },
        {
          $set: { isRead: true },
        },
      );

      // Refresh the receiver's unread badge across tabs.
      io.to(getUserRoom(receiverId)).emit("unread-count-updated");
    } catch (error) {
      console.error("Mark messages as read error:", error);
    }
  });

  // -------------------------------------------------------
  // REFRESH UNREAD COUNT
  // -------------------------------------------------------

  socket.on("refresh-unread-count", () => {
    if (!socket.userId) return;

    io.to(getUserRoom(socket.userId)).emit("unread-count-updated");
  });

  // -------------------------------------------------------
  // DISCONNECT
  // -------------------------------------------------------

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    const userId = socket.userId;

    if (!userId) return;

    const userSockets = onlineUsers.get(userId);

    if (!userSockets) return;

    // Remove only this socket, not the user's other tabs.
    userSockets.delete(socket.id);

    // Remain online while another tab/device is connected.
    if (userSockets.size > 0) return;

    onlineUsers.delete(userId);

    io.emit("user-status", {
      userId,
      isOnline: false,
    });

    io.emit("online-users", [...onlineUsers.keys()]);
  });
});

// =========================================================
// MIDDLEWARES
// =========================================================

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// =========================================================
// ROUTES
// =========================================================

app.use("/api/auth", authRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/org", orgRoute);
app.use("/api/admin", adminRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/chats", chatRoute);

// =========================================================
// ERROR HANDLING
// =========================================================

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// =========================================================
// SERVER CONNECTION
// =========================================================

const ServerConnection = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server connection failed:", error);
    process.exit(1);
  }
};

ServerConnection();
