// backend/models/GameSession.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This is the schema for *one single event* (like a tap or a round start)
const EventSchema = new Schema({
  timestamp: { type: Date, required: true },
  eventType: { type: String, required: true },
  level: { type: Number, required: true },
  // 'details' is a flexible "anything goes" object
  // This is where we'll store { tappedGem, isCorrect, responseTime, etc. }
  details: { type: Schema.Types.Mixed, default: {} },
});

// This is the main document: one per game session
const GameSessionSchema = new Schema({
  // We'll add this from the React app
  playerId: { type: String, required: true, trim: true },

  // We'll calculate these on the server from the event data
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  finalScore: { type: Number, required: true },
  totalMistakes: { type: Number, required: true, default: 0 },
  // An array of all the events that happened in the game
  events: [EventSchema],
});

module.exports = mongoose.model("GameSession", GameSessionSchema);
