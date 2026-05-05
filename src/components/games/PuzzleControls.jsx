// src/components/games/PuzzleControls.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Puzzle, Award, Clock, RotateCcw } from 'lucide-react';

const PuzzleControls = ({ 
  difficulty, 
  setDifficulty, 
  onReset,
  gameStarted,
  piecesPlaced,
  totalPieces,
  currentTime,
  tryAgainCount,
  formatTime
}) => {
  const difficulties = [
    { 
      id: 'easy', 
      label: 'Easy', 
      pieces: 4, 
      color: 'from-green-400 to-green-500', 
      emoji: '🐱',
      description: '2x2 grid - 4 pieces'
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      pieces: 6, 
      color: 'from-yellow-400 to-orange-500', 
      emoji: '🐶',
      description: '2x3 grid - 6 pieces'
    },
    { 
      id: 'hard', 
      label: 'Hard', 
      pieces: 9, 
      color: 'from-red-400 to-pink-500', 
      emoji: '🐮',
      description: '3x3 grid - 9 pieces'
    }
  ];

  

  const progress = totalPieces > 0 ? (piecesPlaced / totalPieces) * 100 : 0;

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-3xl shadow-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Puzzle className="w-6 h-6 mr-2 text-purple-500" />
        Game Settings
      </h2>

      {/* Stats Summary */}
      {gameStarted && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-700 mb-2">Current Game Stats</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm text-gray-600">Time:</span>
            </div>
            <span className="font-bold text-purple-600">{formatTime(currentTime)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RotateCcw className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm text-gray-600">Try Again:</span>
            </div>
            <span className="font-bold text-orange-600">{tryAgainCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Progress:</span>
            </div>
            <span className="font-bold text-green-600">{piecesPlaced}/{totalPieces}</span>
          </div>
        </div>
      )}

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Choose Level:</h3>
        <div className="space-y-3">
          {difficulties.map((level) => (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty(level.id)}
              className={`
                w-full p-4 rounded-xl text-left transition-all
                bg-gradient-to-r ${level.color}
                ${difficulty === level.id ? 'ring-4 ring-purple-400 shadow-lg' : 'opacity-80 hover:opacity-100'}
              `}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{level.emoji}</span>
                  <div>
                    <div className="font-bold text-lg">{level.label}</div>
                    <div className="text-xs text-white text-opacity-90 mt-1">
                      {level.description}
                    </div>
                  </div>
                </div>
                <div className="text-sm bg-white bg-opacity-30 px-3 py-1 rounded-full">
                  {level.pieces} pieces
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {gameStarted && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pieces placed:</span>
              <span className="font-bold text-purple-600">
                {piecesPlaced} / {totalPieces}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center text-lg font-bold"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          New Game
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Puzzle Tips
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Start with corner pieces
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Look at piece shapes to find matches
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Use numbers to help position pieces
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Try to beat your best time!
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PuzzleControls;