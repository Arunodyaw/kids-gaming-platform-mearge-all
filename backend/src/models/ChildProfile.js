const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childName: {
    type: String,
    required: [true, 'Child name is required']
  },
  childAge: {
    type: Number,
    min: 2,
    max: 18
  },
  diagnosis: {
    type: String,
    enum: ['ADHD', 'ADD', 'None', 'Other'],
    default: 'None'
  },
  notes: {
    type: String
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  preferences: {
    soundEnabled: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
    difficultyPreference: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);