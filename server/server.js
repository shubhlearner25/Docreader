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

// -------------------------------------
// ALLOWED ORIGINS (CORS FIX)
// -------------------------------------
// NOTE: regex cannot be mixed directly with strings inside CORS origin list
// So we use a custom origin function instead.

const allowedOrigins = [
  process.env.CLIENT_URL,                     // Production Vercel URL
  "https://docreader-aa9p.vercel.app",        // Explicit production
  "http://localhost:5173"                     // Local dev
];

// -------------------------------------
// CUSTOM ORIGIN CHECKER (supports regex for ALL preview URLs)
// -------------------------------------
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile, curl, etc.

    // Allow ALL preview Vercel URLs:
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Allow origins explicitly listed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ BLOCKED ORIGIN:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// -------------------------------------
// EXPRESS MIDDLEWARE
// -------------------------------------
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// -------------------------------------
// SOCKET.IO WITH CORS FIX
// -------------------------------------
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("❌ BLOCKED SOCKET.IO ORIGIN:", origin);
      return callback(new Error("Socket.IO CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Initialize document socket logic
documentSocket(io);

// -------------------------------------
// API ROUTES
// -------------------------------------
app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));

// -------------------------------------
// YJS WEBSOCKET SERVER (/collab)
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
// START SERVER
// -------------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
