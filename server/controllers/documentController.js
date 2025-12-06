const crypto = require("crypto");
const Document = require("../models/Document");

exports.createDocument = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const shareId = crypto.randomBytes(8).toString("hex");

    const doc = await Document.create({
      title,
      ownerId: req.user._id,
      collaborators: [req.user._id],
      shareId,
      accessMode: "private",
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Create doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [{ ownerId: req.user._id }, { collaborators: req.user._id }],
    }).sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    console.error("Get docs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    console.error("Get doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { content, title } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (typeof content === "string") doc.content = content;
    if (typeof title === "string") doc.title = title;
    doc.lastUpdated = Date.now();

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error("Update doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error("Delete doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public access by shareId
exports.getDocumentByShareId = async (req, res) => {
  try {
    const doc = await Document.findOne({ shareId: req.params.shareId });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({
      title: doc.title,
      content: doc.content,
      accessMode: doc.accessMode,
      shareId: doc.shareId,
      id: doc._id,
    });
  } catch (err) {
    console.error("Get share doc error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update share settings
exports.updateShareSettings = async (req, res) => {
  try {
    const { accessMode } = req.body;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (!["public_view", "public_edit", "private"].includes(accessMode)) {
      return res.status(400).json({ message: "Invalid accessMode" });
    }

    doc.accessMode = accessMode;
    await doc.save();

    res.json({
      message: "Share settings updated",
      accessMode: doc.accessMode,
      shareId: doc.shareId,
    });
  } catch (err) {
    console.error("Update share settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
