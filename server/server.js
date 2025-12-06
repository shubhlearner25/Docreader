const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Socket.IO real-time features
const documentSocket = require("./sockets/documentSocket");

// Yjs WebSocket
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// -------------------------------------
// CORS CONFIG (VERCEL + LOCALHOST)
// -------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://docreader-aa9p.vercel.app",
  "https://docreader-aa9p-anebpf9wg-shubham-s-projects-6ea9a6cd.vercel.app",
  "http://localhost:5173"
];

// -------------------------------------
// Socket.IO (Real-time presence + typing)
// -------------------------------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

documentSocket(io);

// -------------------------------------
// Express Middleware
// -------------------------------------
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// -------------------------------------
// API Routes
// -------------------------------------
app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));

// -------------------------------------
// Yjs WebSocket server (/collab)
// -------------------------------------
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/collab")) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      console.log("Yjs client connected");
      setupWSConnection(ws, req, { gc: true });
    });
  } else {
    socket.destroy();
  }
});

// -------------------------------------
// Start Server
// -------------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
