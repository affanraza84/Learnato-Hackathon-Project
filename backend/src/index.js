require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// -------------------------
// ✅ Environment Variables
// -------------------------
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;  // 👉 REQUIRED (Vercel frontend URL)

if (!FRONTEND_URL) {
  console.warn("⚠️ FRONTEND_URL not provided. Add it in Render Env Vars.");
}

// -------------------------
// ✅ Socket.io Configuration (Fixes Vercel CORS / polling)
// -------------------------
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,  // ✅ must be EXACT frontend domain (no *)
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"], // websocket first
  },
});

// Real-time listeners
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// -------------------------
// ✅ Middleware
// -------------------------
app.use(
  cors({
    origin: FRONTEND_URL, // ✅ whitelist exact Vercel domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// -------------------------
// ✅ API Routes
// -------------------------
const postsRouterFactory = require("./routes/posts");
app.use("/api/posts", postsRouterFactory(io));

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "✅ Learnato Forum Backend Running Successfully",
  });
});

// -------------------------
// ✅ MongoDB + Server Start
// -------------------------
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`🚀 Backend & WebSocket running on PORT ${PORT}`);
      console.log(`🌐 Allowed Origin: ${FRONTEND_URL}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  });
