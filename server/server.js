const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Socket.IO document presence
const documentSocket = require("./sockets/documentSocket");

// Yjs WebSocket
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// -------------------------------
// SOCKET.IO (typing + presence)
// -------------------------------
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

documentSocket(io);

// -------------------------------
// Middleware
// -------------------------------
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// -------------------------------
// API Routes
// -------------------------------
app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));

// -------------------------------
// CORRECT YJS WEBSOCKET SERVER
// Accept only /collab WebSocket upgrades
// (fixes invalid frame errors)
// -------------------------------
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/collab")) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      console.log("Yjs client connected to collab");
      setupWSConnection(ws, req, { gc: true });
    });
  } else {
    socket.destroy(); // reject all other ws upgrades
  }
});

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
