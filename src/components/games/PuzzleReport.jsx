// src/components/games/PuzzleReport.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Clock, RotateCcw, Puzzle,
  Trophy, Star, Award, Trash2, BarChart3,
  FileText, Printer, TrendingUp, Calendar,
  Filter, ChevronLeft, ChevronRight, Info,
  MousePointer, Activity, Zap, Target, Compass
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

import {
  formatTime,
  getPerformanceRating,
  getMouseBehaviorRating,
  generatePDFReport,
  getGameStats,
  clearGameStats
} from '../../utils/puzzleReportUtils';

const PuzzleReport = ({ childName = 'My Child' }) => {
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [viewMode, setViewMode] = useState('all');
  const [timeRange, setTimeRange] = useState(30);
  const [sortBy, setSortBy] = useState('date');
  const [achievements, setAchievements] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMouseInsights, setShowMouseInsights] = useState(true);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Update filtered stats when viewMode or timeRange changes
  useEffect(() => {
    filterStats();
  }, [stats, viewMode, timeRange]);

  // Calculate achievements when stats change
  useEffect(() => {
    calculateAchievements();
  }, [stats]);

  const loadStats = () => {
    const gameStats = getGameStats();
    setStats(gameStats);
  };

  const filterStats = () => {
    let filtered = [...stats];

    if (viewMode !== 'all') {
      filtered = filtered.filter(stat => stat.level === viewMode);
    }

    const cutoffDate = subDays(new Date(), timeRange);
    filtered = filtered.filter(stat => parseISO(stat.date) >= cutoffDate);

    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'time') return (a.time || 0) - (b.time || 0);
      if (sortBy === 'tries') return (a.tries || 0) - (b.tries || 0);
      return 0;
    });

    setFilteredStats(filtered);
  };

  const calculateAchievements = () => {
    const newAchievements = [];

    ['easy', 'medium', 'hard'].forEach(level => {
      const levelStats = stats.filter(s => s.level === level);
      if (levelStats.length === 0) return;

      const bestTime = Math.min(...levelStats.map(s => s.time || Infinity));
      const bestTries = Math.min(...levelStats.map(s => s.tries || Infinity));
      const bestSpeed = Math.max(...levelStats.map(s => s.mouseData?.avgSpeed || 0));

      const recentStat = levelStats[levelStats.length - 1];
      if (recentStat) {
        if (recentStat.time === bestTime) {
          newAchievements.push({
            type: 'bestTime',
            level,
            value: bestTime,
            date: recentStat.date,
            message: `🏆 New Best Time on ${level}! (${formatTime(bestTime)})`
          });
        }
        if (recentStat.tries === bestTries) {
          newAchievements.push({
            type: 'bestTries',
            level,
            value: bestTries,
            date: recentStat.date,
            message: `🎯 Fewest Tries on ${level}! (${bestTries} tries)`
          });
        }
        if (recentStat.mouseData?.avgSpeed > bestSpeed * 0.9) {
          newAchievements.push({
            type: 'bestSpeed',
            level,
            value: recentStat.mouseData.avgSpeed,
            date: recentStat.date,
            message: `⚡ New Speed Record on ${level}! (${Math.round(recentStat.mouseData.avgSpeed)} px/s)`
          });
        }
      }
    });

    if (stats.length >= 3) {
      const sorted = [...stats].sort((a, b) => new Date(a.date) - new Date(b.date));
      let currentStreak = 1;
      let bestStreak = 1;

      for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i - 1].date);
        const currDate = new Date(sorted[i].date);
        const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (diffDays <= 2) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      if (bestStreak >= 3) {
        newAchievements.push({
          type: 'streak',
          value: bestStreak,
          message: `🔥 ${bestStreak} day play streak! Keep it up!`
        });
      }
    }

    setAchievements(newAchievements.slice(0, 5));
  };

  // Prepare chart data
  const chartData = filteredStats
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(stat => ({
      date: format(parseISO(stat.date), 'MM/dd'),
      time: stat.time,
      tries: stat.tries,
      level: stat.level,
      avgSpeed: stat.mouseData?.avgSpeed || 0,
      pathLength: stat.mouseData?.totalPathLength || 0,
      fullDate: stat.date
    }));

  // Calculate averages
  const averageTime = filteredStats.length > 0
    ? filteredStats.reduce((sum, s) => sum + (s.time || 0), 0) / filteredStats.length
    : 0;

  const averageTries = filteredStats.length > 0
    ? filteredStats.reduce((sum, s) => sum + (s.tries || 0), 0) / filteredStats.length
    : 0;

  const averageSpeed = filteredStats.length > 0
    ? filteredStats.reduce((sum, s) => sum + (s.mouseData?.avgSpeed || 0), 0) / filteredStats.length
    : 0;

  const bestTime = filteredStats.length > 0
    ? Math.min(...filteredStats.map(s => s.time || Infinity))
    : 0;

  const bestTries = filteredStats.length > 0
    ? Math.min(...filteredStats.map(s => s.tries || Infinity))
    : 0;

  const bestSpeed = filteredStats.length > 0
    ? Math.max(...filteredStats.map(s => s.mouseData?.avgSpeed || 0))
    : 0;

  const handleGeneratePDF = () => {
    generatePDFReport(stats, childName);
  };

  const handleClearStats = () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      clearGameStats();
      loadStats();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center">
              <BarChart3 className="w-10 h-10 mr-3 text-purple-600" />
              Puzzle Progress Report
            </h1>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-gray-600">
            Track progress, spot trends, and celebrate improvements
          </p>
        </motion.div>

        {/* Info Panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg"
          >
            <h3 className="font-bold text-blue-800 mb-2">📋 Understanding the Metrics</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Time:</strong> Longer times may indicate inattention; very short times with errors may suggest impulsivity.</li>
              <li><strong>Try Again:</strong> High error counts could reflect working memory or impulse control challenges.</li>
              <li><strong>Mouse Speed:</strong> Very fast movement with errors = impulsivity; very slow movement = hesitation or inattention.</li>
              <li><strong>Path Efficiency:</strong> Wandering paths may indicate difficulty planning or staying focused.</li>
              <li><strong>Trends:</strong> Improvement over time is a positive sign; plateaus or declines may warrant attention.</li>
              <li className="mt-2 italic">Note: This is not a diagnostic tool. Consult a professional for concerns.</li>
            </ul>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePDF}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 flex items-center shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Report
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearStats}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 flex items-center shadow-lg"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear History
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Filter by Level</label>
              <div className="flex gap-2">
                {['all', 'easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setViewMode(level)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      viewMode === level
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Time Range</label>
              <div className="flex gap-2">
                {[7, 14, 30, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeRange === days
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Sort by</label>
              <div className="flex gap-2">
                {[
                  { value: 'date', label: 'Date', icon: '📅' },
                  { value: 'time', label: 'Time', icon: '⏱️' },
                  { value: 'tries', label: 'Tries', icon: '🔄' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards - Updated with Mouse Speed */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-bold">{filteredStats.length}</span>
            </div>
            <h3 className="text-gray-600 text-sm">Games in Period</h3>
            <p className="text-2xl font-bold text-gray-800">{filteredStats.length}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm">Average Time</h3>
            <p className="text-2xl font-bold text-gray-800">{formatTime(averageTime)}</p>
            <p className="text-xs text-green-600 mt-1">Best: {formatTime(bestTime)}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm">Average Tries</h3>
            <p className="text-2xl font-bold text-gray-800">{averageTries.toFixed(1)}</p>
            <p className="text-xs text-green-600 mt-1">Best: {bestTries}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm">Avg Mouse Speed</h3>
            <p className="text-2xl font-bold text-gray-800">{Math.round(averageSpeed)} px/s</p>
            <p className="text-xs text-green-600 mt-1">Best: {Math.round(bestSpeed)} px/s</p>
          </motion.div>
        </div>

        {/* Achievement Highlights */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-xl border border-yellow-200 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-xl p-4 flex items-center shadow-md"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl mr-3">
                    {ach.type.includes('best') ? '🏆' : 
                     ach.type === 'streak' ? '🔥' : 
                     ach.type === 'bestSpeed' ? '⚡' : '⭐'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{ach.message}</p>
                    {ach.date && (
                      <p className="text-xs text-gray-500">
                        {format(parseISO(ach.date), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mouse Behavior Insights Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <MousePointer className="w-6 h-6 mr-2 text-purple-500" />
            Mouse Behavior Analysis
          </h2>
          <button
            onClick={() => setShowMouseInsights(!showMouseInsights)}
            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
          >
            {showMouseInsights ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Mouse Behavior Insights */}
        {showMouseInsights && chartData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mouse Speed Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-pink-500" />
                  Mouse Speed Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow rounded border">
                              <p className="font-bold">{label}</p>
                              <p>Speed: {Math.round(data.avgSpeed)} px/s</p>
                              <p>Path: {Math.round(data.pathLength)} px</p>
                              <p className="capitalize">Level: {data.level}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgSpeed"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Speed (px/s)"
                    />
                    <ReferenceLine y={averageSpeed} stroke="#9ca3af" strokeDasharray="3 3" label="Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Path Length Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <Compass className="w-5 h-5 mr-2 text-blue-500" />
                  Path Length Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow rounded border">
                              <p className="font-bold">{label}</p>
                              <p>Path: {Math.round(data.pathLength)} px</p>
                              <p>Speed: {Math.round(data.avgSpeed)} px/s</p>
                              <p className="capitalize">Level: {data.level}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pathLength"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Path Length (px)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mouse Behavior Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {filteredStats.slice(-3).map((stat, idx) => {
                const mouseRating = getMouseBehaviorRating(
                  stat.mouseData?.avgSpeed || 0,
                  stat.mouseData?.totalPathLength || 0,
                  stat.pieces
                );
                
                return (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      {format(parseISO(stat.date), 'MMM d, h:mm a')}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Speed:</span>
                        <span style={{ color: mouseRating.speed.color }}>
                          {mouseRating.speed.emoji} {mouseRating.speed.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Path:</span>
                        <span style={{ color: mouseRating.efficiency.color }}>
                          {mouseRating.efficiency.emoji} {mouseRating.efficiency.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Level:</span>
                        <span className="capitalize font-medium">{stat.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trend Charts - Time & Tries */}
        {chartData.length > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
              Progress Trends
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Time Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Completion Time (seconds)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow rounded border">
                              <p className="font-bold">{label}</p>
                              <p>Time: {formatTime(data.time)}</p>
                              <p>Tries: {data.tries}</p>
                              <p>Speed: {Math.round(data.avgSpeed)} px/s</p>
                              <p className="capitalize">Level: {data.level}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Time (s)"
                    />
                    <ReferenceLine y={averageTime} stroke="#9ca3af" strokeDasharray="3 3" label="Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tries Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Try Again Count</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow rounded border">
                              <p className="font-bold">{label}</p>
                              <p>Tries: {data.tries}</p>
                              <p>Time: {formatTime(data.time)}</p>
                              <p>Speed: {Math.round(data.avgSpeed)} px/s</p>
                              <p className="capitalize">Level: {data.level}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tries"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Tries"
                    />
                    <ReferenceLine y={averageTries} stroke="#9ca3af" strokeDasharray="3 3" label="Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interpretation note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
              <p><strong>Trend interpretation:</strong> Consistent downward trends in time and tries indicate improving skills. 
              Mouse speed increasing over time with fewer errors suggests growing confidence. 
              Highly erratic mouse movements may indicate attention fluctuation. Discuss with your therapist.</p>
            </div>
          </div>
        )}

        {/* Game History Table - Updated with Mouse Data */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-500" />
            Game History
          </h2>

          {filteredStats.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">🧩</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Games in this Period</h3>
              <p className="text-gray-600">Play some puzzles to see your progress!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <th className="px-4 py-3 rounded-tl-lg text-left">Date</th>
                    <th className="px-4 py-3 text-left">Level</th>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Tries</th>
                    <th className="px-4 py-3 text-left">Mouse Speed</th>
                    <th className="px-4 py-3 text-left">Path</th>
                    <th className="px-4 py-3 rounded-tr-lg text-left">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((stat, index) => {
                    const rating = getPerformanceRating(stat.tries, stat.time, stat.level);
                    const mouseRating = getMouseBehaviorRating(
                      stat.mouseData?.avgSpeed || 0,
                      stat.mouseData?.totalPathLength || 0,
                      stat.pieces
                    );
                    const date = parseISO(stat.date);

                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          {format(date, 'MMM d, h:mm a')}
                        </td>
                        <td className="px-4 py-3 font-medium capitalize">
                          <span className={`
                            px-3 py-1 rounded-full text-xs
                            ${stat.level === 'easy' ? 'bg-green-100 text-green-700' :
                              stat.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'}
                          `}>
                            {stat.level}
                          </span>
                        </td>
                        
                        <td className="px-4 py-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-500" />
                            {formatTime(stat.time)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center">
                            <RotateCcw className="w-4 h-4 mr-1 text-orange-500" />
                            {stat.tries}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center" style={{ color: mouseRating.speed.color }}>
                            {mouseRating.speed.emoji}
                            <span className="ml-1">{Math.round(stat.mouseData?.avgSpeed || 0)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center" style={{ color: mouseRating.efficiency.color }}>
                            {mouseRating.efficiency.emoji}
                            <span className="ml-1">{Math.round(stat.mouseData?.totalPathLength || 0)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: rating.color + '20',
                              color: rating.color
                            }}
                          >
                            {rating.emoji} {rating.rating}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleReport;