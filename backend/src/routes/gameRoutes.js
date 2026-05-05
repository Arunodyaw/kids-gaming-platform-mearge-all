// backend/src/routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  saveGameSession,
  getGameSessions,
  getGameStats,
  getRecentGames
} = require('../controllers/gameController');

// All game routes are protected
router.use(protect);

// Save game session
router.post('/save', saveGameSession);

// Get game sessions for a child
router.get('/sessions/:childId', getGameSessions);

// Get game statistics for a child
router.get('/stats/:childId', getGameStats);

// Get recent games for a child
router.get('/recent/:childId', getRecentGames);

module.exports = router;