const PuzzleData = require('../models/PuzzleData');

const bulkUploadPuzzleData = async (req, res) => {
  try {
    const { gameDataArray } = req.body;

    if (!Array.isArray(gameDataArray) || gameDataArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'gameDataArray must be a non-empty array'
      });
    }

    const inserted = await PuzzleData.insertMany(gameDataArray);

    res.status(201).json({
      success: true,
      message: 'Puzzle game data uploaded successfully',
      count: inserted.length,
      insertedIds: inserted.map(doc => doc._id)
    });
  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload puzzle game data',
      error: error.message
    });
  }
};

const getPuzzleHistory = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username query parameter is required'
      });
    }

    const history = await PuzzleData.find({ username })
      .sort({ date: -1 })
      .lean();

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('❌ Get puzzle history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch puzzle history',
      error: error.message
    });
  }
};

const getPuzzleStats = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username query parameter is required'
      });
    }

    const stats = await PuzzleData.aggregate([
      { $match: { username } },
      {
        $group: {
          _id: '$level',
          totalGames: { $sum: 1 },
          avgPieces: { $avg: '$pieces' },
          avgTimeTaken: { $avg: '$timeTaken' },
          avgTries: { $avg: '$tries' },
          avgMouseSpeed: { $avg: '$mouseSpeed' },
          avgPath: { $avg: '$path' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Get puzzle stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch puzzle statistics',
      error: error.message
    });
  }
};

module.exports = {
  bulkUploadPuzzleData,
  getPuzzleHistory,
  getPuzzleStats
};
