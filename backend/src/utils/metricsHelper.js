// src/utils/metricsHelper.js
const calculateMouseMetrics = (mousePath) => {
  if (!mousePath || mousePath.length < 2) {
    return {
      avgSpeed: 0,
      totalPathLength: 0,
      totalPoints: mousePath?.length || 0,
      speedVariance: 0,
      pathEfficiency: 0
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
    pathEfficiency
  };
};

const getPerformanceRating = (time, tries, difficulty) => {
  const baseTime = { easy: 60, medium: 120, hard: 240 };
  const baseTries = { easy: 5, medium: 10, hard: 20 };
  
  const timeRatio = time / baseTime[difficulty];
  const triesRatio = tries / baseTries[difficulty];
  
  const score = (timeRatio + triesRatio) / 2;
  
  if (score <= 0.7) return { rating: 'Excellent', color: '#10b981', emoji: '🏆' };
  if (score <= 1.0) return { rating: 'Good', color: '#3b82f6', emoji: '⭐' };
  if (score <= 1.5) return { rating: 'Average', color: '#f59e0b', emoji: '👍' };
  return { rating: 'Needs Practice', color: '#ef4444', emoji: '💪' };
};

module.exports = { calculateMouseMetrics, getPerformanceRating };