const mongoose = require('mongoose');

const puzzleDataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  level: { type: String, required: true },
  pieces: { type: Number, required: true },
  time: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  tries: { type: Number, default: 0 },
  mouseSpeed: { type: Number, default: 0 },
  path: { type: Number, default: 0 },
  rating: { type: String, default: '' },
  gameType: { type: String, default: 'puzzle_game' }
});

module.exports = mongoose.model('PuzzleData', puzzleDataSchema, 'puzzle_data');
