const collaborators = {}; // { documentId: { socketId: { username } } }

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a document room
    socket.on("join-document", ({ documentId, username }) => {
      socket.join(documentId);
      socket.documentId = documentId;
      socket.username = username;

      if (!collaborators[documentId]) collaborators[documentId] = {};
      collaborators[documentId][socket.id] = { username };

      io.to(documentId).emit(
        "collaborators-update",
        Object.values(collaborators[documentId])
      );
    });

    // Real-time text syncing (not used by TipTap/Yjs core, but kept for extra events)
    socket.on("typing", ({ documentId, content }) => {
      socket.to(documentId).emit("receive-text", content);
    });

    // Typing indicator
    socket.on("typing-start", ({ documentId, username }) => {
      socket.to(documentId).emit("show-typing", { username });
    });

    socket.on("typing-stop", ({ documentId, username }) => {
      socket.to(documentId).emit("hide-typing", { username });
    });

    socket.on("disconnect", () => {
      const { documentId } = socket;
      if (documentId && collaborators[documentId]) {
        delete collaborators[documentId][socket.id];
        io.to(documentId).emit(
          "collaborators-update",
          Object.values(collaborators[documentId])
        );
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};
