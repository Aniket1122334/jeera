require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-connection");
const cp = require("cookie-parser");
const cors = require("cors");
const app = express();

// routes import
const authRoute = require("./routes/authRoutes/authRoutes");
const orgRoute = require("./routes/orgRoutes/orgRoutes");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cp());
app.use(
  cors({
    credentials: true, //allowing browser to request cookies
  }),
);

// routes
app.use("/api/auth/", authRoute);
app.use("/api/org/", orgRoute);

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
  });
});

const Server = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
};

Server();
