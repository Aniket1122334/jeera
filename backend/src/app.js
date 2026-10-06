require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-connection");
const cp = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// routes import
const authRoute = require("./routes/authRoutes/authRoutes");
const orgRoute = require("./routes/orgRoutes/orgRoutes");
const adminRoute = require("./routes/adminRoutes/adminRoutes");
const employeeRoute = require("./routes/employeeRoutes/employeeRoutes");
const analyticsRoute = require("./routes/analyticsRoutes/analyticsRoutes");
const chatRoute = require("./routes/chatRoutes/chatRoutes");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cp());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

// routes
app.use("/api/auth/", authRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/org/", orgRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/chats", chatRoute);

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});

const ServerConnection = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
};

ServerConnection();
