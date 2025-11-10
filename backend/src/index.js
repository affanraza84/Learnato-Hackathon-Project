require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Load from environment or fallback
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/learnato_forum";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";  // example: https://learnato-frontend.vercel.app

// ✅ Updated Socket.io configuration (fixes Vercel + Render CORS issues)
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,              // MUST be your frontend URL (no trailing slash)
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"], // Allow websocket + fallback polling
  },
  allowEIO3: true, // supports older clients
});

// 🔥 Real-time socket listeners
io.on("connection", (socket) => {
  console.log("✅ Socket connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected: ", socket.id);
  });
});

// ✅ Middleware
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ API Routes
const postsRouterFactory = require("./routes/posts");
app.use("/api/posts", postsRouterFactory(io));

// Health check endpoint
app.get("/", (req, res) => {
  res.send({ ok: true, message: "✅ Learnato Forum Backend Running" });
});

// ✅ MongoDB Connection + Listen
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    server.listen(PORT, () =>
      console.log(`🚀 Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  });
