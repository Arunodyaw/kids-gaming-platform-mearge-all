const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
    {
        participantId: { type: String, required: true },
        timezone: { type: String, default: "WITA" },
        game: { name: String, version: String },
        startedAt: { type: Date, default: () => new Date() },
        endedAt: { type: Date },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", SessionSchema);

module.exports = { Session };
