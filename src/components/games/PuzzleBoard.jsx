// src/components/games/PuzzleBoard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const PuzzleBoard = ({ 
  boardPieces, 
  pieces,
  onDrop, 
  onRemove, 
  difficulty, 
  imageUrl,
  lastPlacedPiece,
  incorrectAttempts 
}) => {
  const [dragOver, setDragOver] = useState(null);

  // Grid layout based on difficulty
  const gridClasses = {
    easy: 'grid-cols-2 gap-0 max-w-md mx-auto',
    medium: 'grid-cols-3 gap-0 max-w-md mx-auto',
    hard: 'grid-cols-3 gap-0 max-w-md mx-auto'
  };

  const cellSizeClasses = {
    easy: 'w-32 h-32 md:w-56 md:h-60',
    medium: 'w-24 h-24 md:w-38 md:h-35',
    hard: 'w-20 h-20 md:w-38 md:h-38'
  };

  // Handle drag over
  const handleDragOver = (e, boardId) => {
    e.preventDefault();
    const boardPos = boardPieces.find(b => b.id === boardId);
    // Don't allow drag over if cell is locked
    if (!boardPos?.isLocked) {
      setDragOver(boardId);
    }
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  // Handle drop
  const handleDrop = (e, boardId) => {
    e.preventDefault();
    setDragOver(null);
    
    const boardPos = boardPieces.find(b => b.id === boardId);
    // Don't allow drop on locked cells
    if (boardPos?.isLocked) return;
    
    const pieceId = e.dataTransfer.getData('pieceId');
    if (pieceId) {
      onDrop(pieceId, boardId);
    }
  };

  // Check if this cell had an incorrect attempt
  const isIncorrectAttempt = (boardId) => {
    return incorrectAttempts.some(attempt => attempt.boardId === boardId);
  };

  // Check if this cell just received a correct piece
  const isJustPlaced = (boardId, pieceId) => {
    return lastPlacedPiece === pieceId;
  };

  // Get piece image style
  const getPieceStyle = (cell) => {
    if (!cell.piece) return {};
    
    const pieceData = pieces.find(p => p.id === cell.piece);
    if (!pieceData) return {};
    
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${difficulty === 'easy' ? '322%' : 
                        difficulty === 'medium' ? '300%' : '320%'}`,
      backgroundPosition: `${pieceData.col * 50}% ${pieceData.row * 50}%`
    };
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        Puzzle Board
      </h2>
      
      <div className={`grid ${gridClasses[difficulty]} justify-center`}>
        {boardPieces.map((cell) => {
          const incorrect = isIncorrectAttempt(cell.id);
          const placed = cell.piece && isJustPlaced(cell.id, cell.piece);
          const isLocked = cell.isLocked;
          
          return (
            <div
              key={cell.id}
              onDragOver={(e) => handleDragOver(e, cell.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cell.id)}
              onClick={() => !isLocked && cell.piece && onRemove(cell.id)}
              className={`
                ${cellSizeClasses[difficulty]}
                relative border-4 rounded-xl
                transition-all duration-300
                ${!isLocked ? 'cursor-pointer' : 'cursor-default'}
                transform hover:scale-105
                ${isLocked 
                  ? 'border-green-600 bg-green-50 shadow-lg shadow-green-200' 
                  : cell.piece 
                    ? placed
                      ? 'border-green-500 shadow-lg shadow-green-200' 
                      : 'border-green-400'
                    : dragOver === cell.id && !isLocked
                      ? 'border-purple-500 bg-purple-100 scale-105 shadow-lg' 
                      : incorrect && !isLocked
                        ? 'border-red-500 bg-red-100 animate-shake'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
              `}
            >
              {cell.piece && (
                <>
                  {/* Placed piece */}
                  <motion.div 
                    initial={placed ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-lg bg-cover bg-no-repeat"
                    style={getPieceStyle(cell)}
                  />
                  
                  {/* Lock icon for locked pieces */}
                  {isLocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 left-1 bg-green-600 text-white p-1 rounded-full"
                    >
                      <Lock className="w-4 h-4" />
                    </motion.div>
                  )}
                  
                  {/* Good job indicator for newly placed piece */}
                  {placed && !isLocked && (
                    <motion.div
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap z-10"
                    >
                      ✨ Good Job! ✨
                    </motion.div>
                  )}
                  
                  {/* Remove indicator - only for unlocked pieces */}
                  {!isLocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity">
                      ✕
                    </div>
                  )}
                </>
              )}
              
              {/* Position number */}
              <div className="absolute bottom-1 left-1 w-5 h-5 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white text-xs">
                {cell.row * (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4) + cell.col + 1}
              </div>
              
              {/* Try again message for incorrect attempts */}
              {incorrect && !cell.piece && !isLocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    Try Again!
                  </div>
                </motion.div>
              )}

              {/* Lock message */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-green-500 bg-opacity-20 rounded-lg">
                  <span className="text-green-700 font-bold text-sm">✓ Locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-green-600 rounded-full mr-2"></span>
          <span>Locked (Correct)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-green-400 rounded-full mr-2"></span>
          <span>Placed (Unlocked)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
          <span>Try Again!</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PuzzleBoard;