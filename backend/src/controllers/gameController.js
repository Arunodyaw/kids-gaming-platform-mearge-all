// backend/src/controllers/gameController.js
const GameSession = require('../models/GameSession');
const ChildProfile = require('../models/ChildProfile');
const mongoose = require('mongoose');

// Helper function to calculate mouse metrics
const calculateMouseMetrics = (mousePath) => {
  if (!mousePath || mousePath.length < 2) {
    return {
      avgSpeed: 0,
      totalPathLength: 0,
      totalPoints: mousePath?.length || 0,
      speedVariance: 0,
      pathEfficiency: 0,
      mousePath: mousePath || []
    };
  }

  let totalDistance = 0;
  let speeds = [];
  
  for (let i = 1; i < mousePath.length; i++) {
    const prev = mousePath[i - 1];
    const curr = mousePath[i];
    
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dt = curr.timestamp - prev.timestamp;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    totalDistance += distance;
    
    if (dt > 0) {
      speeds.push(distance / dt);
    }
  }
  
  const avgSpeed = speeds.length > 0 
    ? speeds.reduce((a, b) => a + b, 0) / speeds.length 
    : 0;
  
  const speedVariance = speeds.length > 1
    ? speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length
    : 0;
  
  // Estimate optimal path (simplified)
  const firstPoint = mousePath[0];
  const lastPoint = mousePath[mousePath.length - 1];
  const straightLineDistance = Math.sqrt(
    Math.pow(lastPoint.x - firstPoint.x, 2) + 
    Math.pow(lastPoint.y - firstPoint.y, 2)
  );
  
  const pathEfficiency = straightLineDistance > 0 
    ? totalDistance / straightLineDistance 
    : 1;

  return {
    avgSpeed: avgSpeed * 1000, // Convert to pixels per second
    totalPathLength: totalDistance,
    totalPoints: mousePath.length,
    speedVariance,
    pathEfficiency,
    mousePath: mousePath.slice(-100) // Store last 100 points
  };
};

// @desc    Save game session
// @route   POST /api/games/save
// @access  Private
const saveGameSession = async (req, res) => {
  try {
    console.log('🎮 Saving game session for child:', req.body.childId);
    
    const { 
      childId, 
      difficulty, 
      pieces, 
      timeCompleted, 
      tryAgainCount,
      mouseData 
    } = req.body;

    // Validate required fields
    if (!childId || !difficulty || !pieces || !timeCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: ['childId, difficulty, pieces, and timeCompleted are required']
      });
    }

    // Verify child belongs to parent
    const child = await ChildProfile.findOne({ 
      _id: childId, 
      parentId: req.user.id 
    });
    
    if (!child) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to save session for this child'
      });
    }

    // Calculate metrics if mouse data provided
    let processedMouseData = null;
    if (mouseData && mouseData.mousePath) {
      processedMouseData = calculateMouseMetrics(mouseData.mousePath);
    }

    // Create game session
    const gameSession = new GameSession({
      childId,
      parentId: req.user.id,
      difficulty,
      pieces,
      timeCompleted,
      tryAgainCount: tryAgainCount || 0,
      mouseData: processedMouseData,
      completed: true
    });

    await gameSession.save();

    console.log('✅ Game session saved with ID:', gameSession._id);

    res.status(201).json({
      success: true,
      message: 'Game session saved successfully',
      data: {
        id: gameSession._id,
        childId: gameSession.childId,
        difficulty: gameSession.difficulty,
        timeCompleted: gameSession.timeCompleted,
        tryAgainCount: gameSession.tryAgainCount,
        date: gameSession.date
      }
    });

  } catch (error) {
    console.error('❌ Save game error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save game session',
      error: error.message
    });
  }
};

// @desc    Get game sessions for a child
// @route   GET /api/games/sessions/:childId
// @access  Private
const getGameSessions = async (req, res) => {
  try {
    const { childId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    // Verify child belongs to parent
    const child = await ChildProfile.findOne({ 
      _id: childId, 
      parentId: req.user.id 
    });
    
    if (!child) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view sessions for this child'
      });
    }

    const skip = (page - 1) * limit;

    const sessions = await GameSession.find({ childId })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await GameSession.countDocuments({ childId });

    res.json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game sessions'
    });
  }
};

// @desc    Get statistics for a child
// @route   GET /api/games/stats/:childId
// @access  Private
const getGameStats = async (req, res) => {
  try {
    const { childId } = req.params;

    // Verify child belongs to parent
    const child = await ChildProfile.findOne({ 
      _id: childId, 
      parentId: req.user.id 
    });
    
    if (!child) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view stats for this child'
      });
    }

    // Get overall statistics
    const stats = await GameSession.aggregate([
      { $match: { childId: new mongoose.Types.ObjectId(childId) } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          avgTime: { $avg: '$timeCompleted' },
          avgTries: { $avg: '$tryAgainCount' },
          bestTime: { $min: '$timeCompleted' },
          bestTries: { $min: '$tryAgainCount' },
          totalTime: { $sum: '$timeCompleted' },
          totalTries: { $sum: '$tryAgainCount' }
        }
      }
    ]);

    // Get statistics by difficulty
    const byDifficulty = await GameSession.aggregate([
      { $match: { childId: new mongoose.Types.ObjectId(childId) } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          avgTime: { $avg: '$timeCompleted' },
          avgTries: { $avg: '$tryAgainCount' },
          bestTime: { $min: '$timeCompleted' }
        }
      }
    ]);

    // Get daily progress for charts
    const dailyProgress = await GameSession.aggregate([
      { $match: { childId: new mongoose.Types.ObjectId(childId) } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          avgTime: { $avg: '$timeCompleted' },
          avgTries: { $avg: '$tryAgainCount' },
          gamesPlayed: { $sum: 1 },
          date: { $first: '$date' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 }
    ]);

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          totalGames: 0,
          avgTime: 0,
          avgTries: 0,
          bestTime: 0,
          bestTries: 0
        },
        byDifficulty,
        dailyProgress: dailyProgress.map(day => ({
          date: `${day._id.year}-${day._id.month}-${day._id.day}`,
          avgTime: day.avgTime,
          avgTries: day.avgTries,
          gamesPlayed: day.gamesPlayed
        }))
      }
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// @desc    Get recent games for dashboard
// @route   GET /api/games/recent/:childId
// @access  Private
const getRecentGames = async (req, res) => {
  try {
    const { childId } = req.params;
    const { limit = 5 } = req.query;

    const child = await ChildProfile.findOne({ 
      _id: childId, 
      parentId: req.user.id 
    });
    
    if (!child) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const recentGames = await GameSession.find({ childId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: recentGames
    });

  } catch (error) {
    console.error('❌ Recent games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent games'
    });
  }
};

module.exports = {
  saveGameSession,
  getGameSessions,
  getGameStats,
  getRecentGames
};