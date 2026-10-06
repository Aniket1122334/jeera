const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: "Org", required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

messageSchema.index({ teamId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
