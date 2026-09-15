require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db-connection");
const app = express();

// routes import

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

const Server = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
};

Server();
