const { Router } = require("express");
const { z } = require("zod");
const { Session } = require("../models/Session");
const { GazeSample } = require("../models/GazeSample");
const { GameEvent } = require("../models/GameEvent");
const mongoose = require("mongoose");

const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
    const schema = z.object({
        participantId: z.string().min(1),
        timezone: z.string().optional(),
        game: z.object({ name: z.string(), version: z.string() }).optional(),
    });

    const body = schema.parse(req.body);
    const session = await Session.create(body);
    return res.json({ sessionId: session._id.toString() });
});

sessionsRouter.post("/:sessionId/ingest", async (req, res) => {
    const { sessionId } = req.params;
    if (!mongoose.isValidObjectId(sessionId)) {
        return res.status(400).json({ error: "Invalid sessionId" });
    }

    const schema = z.object({
        gazeSamples: z.array(z.any()).default([]),
        gameEvents: z.array(z.any()).default([]),
    });

    const body = schema.parse(req.body);
    const sessionObjectId = new mongoose.Types.ObjectId(sessionId);

    try {
        // Insert gaze in bulk (map to model shape)
        if (body.gazeSamples.length) {
            await GazeSample.insertMany(
                body.gazeSamples.map((g) => ({
                    sessionId: sessionObjectId,
                    ts: g.ts,
                    facePresent: !!g.facePresent,
                    gazeX: g.gazeX,
                    gazeY: g.gazeY,
                })),
                { ordered: false }
            );
        }

        if (body.gameEvents.length) {
            await GameEvent.insertMany(
                body.gameEvents.map((e) => ({
                    sessionId: sessionObjectId,
                    type: e.type,
                    ts: e.ts,
                    payload: { ...e },
                })),
                { ordered: false }
            );
        }

        return res.json({ ok: true });
    } catch (error) {
        console.error("Ingest error:", error);
        return res.status(500).json({ error: "Failed to store data", details: error.message });
    }
});

module.exports = { sessionsRouter };
