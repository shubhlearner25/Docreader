const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentByShareId,
  updateShareSettings,
} = require("../controllers/documentController");

// Public route for share links
router.get("/share/:shareId", getDocumentByShareId);

// Protected routes
router.use(protect);

router.post("/", createDocument);
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);
router.put("/:id/share", updateShareSettings);

module.exports = router;
