const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    socketId: { type: String, required: true },
    loginAt: { type: Date, required: true },
    lastActiveAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);