const mongoose = require('mongoose');

const mousePointSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  timestamp: Number
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChildProfile',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  pieces: {
    type: Number,
    required: true
  },
  timeCompleted: {
    type: Number,
    required: true
  },
  tryAgainCount: {
    type: Number,
    default: 0
  },
  mouseData: {
    mousePath: [mousePointSchema],
    avgSpeed: Number,
    totalPathLength: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

gameSessionSchema.index({ childId: 1, date: -1 });
gameSessionSchema.index({ parentId: 1, date: -1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);