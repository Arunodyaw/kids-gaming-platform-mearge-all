const mongoose = require("mongoose");

const GazeSampleSchema = new mongoose.Schema(
    {
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
        ts: { type: Number, required: true, index: true },
        facePresent: { type: Boolean, required: true },
        gazeX: { type: Number },
        gazeY: { type: Number },
        landmarks: { type: [Number] }, // optional heavy
    },
    { timestamps: true }
);

GazeSampleSchema.index({ sessionId: 1, ts: 1 });

const GazeSample = mongoose.model("GazeSample", GazeSampleSchema);

module.exports = { GazeSample };
