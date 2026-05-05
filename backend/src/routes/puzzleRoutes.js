const express = require('express');
const router = express.Router();
const {
  bulkUploadPuzzleData,
  getPuzzleHistory,
  getPuzzleStats
} = require('../controllers/puzzleController');

router.post('/bulk', bulkUploadPuzzleData);
router.get('/history', getPuzzleHistory);
router.get('/stats', getPuzzleStats);

module.exports = router;
