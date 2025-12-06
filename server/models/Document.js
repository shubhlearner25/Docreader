const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" }, // last saved HTML
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastUpdated: { type: Date, default: Date.now },

    // sharing fields
    shareId: { type: String, unique: true },
    accessMode: {
      type: String,
      enum: ["private", "public_view", "public_edit"],
      default: "private",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
