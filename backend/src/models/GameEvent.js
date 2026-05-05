const mongoose = require("mongoose");

const GameEventSchema = new mongoose.Schema(
    {
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
        type: { type: String, required: true, index: true },
        ts: { type: Number, required: true, index: true },
        payload: { type: Object, required: true },
    },
    { timestamps: true }
);

GameEventSchema.index({ sessionId: 1, ts: 1 });

const GameEvent = mongoose.model("GameEvent", GameEventSchema);

module.exports = { GameEvent };
