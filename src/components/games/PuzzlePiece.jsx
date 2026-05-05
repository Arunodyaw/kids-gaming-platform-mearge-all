// src/components/games/PuzzlePiece.jsx
import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Lock, Hand, Sparkles } from 'lucide-react';

const PuzzlePiece = ({ piece, index, onDrag, onDrop, difficulty, imageUrl, isLocked }) => {
  const pieceRef = useRef(null);
  const dragControls = useDragControls();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Get edge style based on piece edges
  const getEdgeStyle = () => {
    return {
      clipPath: getClipPath(),
      border: 'none'
    };
  };

  // Generate realistic jigsaw clip path for interlocking tabs and blanks
  const getClipPath = () => {
    const size = 100;
    const tabSize = 18;
    const blankSize = 18;
    
    let path = `M 0 0 `;
    
    // Top edge
    if (piece.top === 'tab') {
      path += `L ${size/2 - tabSize} 0 `;
      path += `C ${size/2 - tabSize/2} -${tabSize}, ${size/2 + tabSize/2} -${tabSize}, ${size/2 + tabSize} 0 `;
    } else if (piece.top === 'blank') {
      path += `L ${size/2 - blankSize} 0 `;
      path += `C ${size/2 - blankSize/2} ${blankSize}, ${size/2 + blankSize/2} ${blankSize}, ${size/2 + blankSize} 0 `;
    } else {
      path += `L ${size} 0 `;
    }
    path += `L ${size} 0 `;
    
    // Right edge
    if (piece.right === 'tab') {
      path += `L ${size} ${size/2 - tabSize} `;
      path += `C ${size + tabSize} ${size/2 - tabSize/2}, ${size + tabSize} ${size/2 + tabSize/2}, ${size} ${size/2 + tabSize} `;
    } else if (piece.right === 'blank') {
      path += `L ${size} ${size/2 - blankSize} `;
      path += `C ${size - blankSize} ${size/2 - blankSize/2}, ${size - blankSize} ${size/2 + blankSize/2}, ${size} ${size/2 + blankSize} `;
    } else {
      path += `L ${size} ${size} `;
    }
    path += `L ${size} ${size} `;
    
    // Bottom edge
    if (piece.bottom === 'tab') {
      path += `L ${size/2 + tabSize} ${size} `;
      path += `C ${size/2 + tabSize/2} ${size + tabSize}, ${size/2 - tabSize/2} ${size + tabSize}, ${size/2 - tabSize} ${size} `;
    } else if (piece.bottom === 'blank') {
      path += `L ${size/2 + blankSize} ${size} `;
      path += `C ${size/2 + blankSize/2} ${size - blankSize}, ${size/2 - blankSize/2} ${size - blankSize}, ${size/2 - blankSize} ${size} `;
    } else {
      path += `L 0 ${size} `;
    }
    path += `L 0 ${size} `;
    
    // Left edge
    if (piece.left === 'tab') {
      path += `L 0 ${size/2 + tabSize} `;
      path += `C -${tabSize} ${size/2 + tabSize/2}, -${tabSize} ${size/2 - tabSize/2}, 0 ${size/2 - tabSize} `;
    } else if (piece.left === 'blank') {
      path += `L 0 ${size/2 + blankSize} `;
      path += `C ${blankSize} ${size/2 + blankSize/2}, ${blankSize} ${size/2 - blankSize/2}, 0 ${size/2 - blankSize} `;
    }
    
    path += `L 0 0`;
    
    return path;
  };

  // Handle drag start - only if piece is not locked
  const handleDragStart = (e) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.setData('pieceId', piece.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (isLocked) return;
    setIsDragging(false);
    const x = e.clientX;
    const y = e.clientY;
    onDrag(piece.id, x, y);
  };

  // Get kid-friendly piece number with emoji
  const getKidFriendlyNumber = () => {
    const num = index + 1;
    const emojis = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯'];
    return emojis[num - 1] || num;
  };

  // Get piece color based on position (for visual appeal)
  const getPieceColor = () => {
    const colors = [
      'from-red-200 to-red-300',
      'from-blue-200 to-blue-300',
      'from-green-200 to-green-300',
      'from-yellow-200 to-yellow-300',
      'from-purple-200 to-purple-300',
      'from-pink-200 to-pink-300',
      'from-indigo-200 to-indigo-300',
      'from-orange-200 to-orange-300'
    ];
    return colors[index % colors.length];
  };

  const sizeClasses = {
    easy: 'w-36 h-36 md:w-40 md:h-40',
    medium: 'w-28 h-28 md:w-32 md:h-32',
    hard: 'w-24 h-24 md:w-28 md:h-28'
  };

  return (
    <motion.div
      ref={pieceRef}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={!isLocked ? { scale: 1.08, zIndex: 10, rotate: 3 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      animate={{
        scale: isDragging ? 1.15 : 1,
        rotate: isDragging ? 5 : 0,
        opacity: isDragging ? 0.7 : 1
      }}
      dragControls={dragControls}
      className={`
        ${sizeClasses[difficulty]}
        relative transition-all duration-200
        bg-cover bg-no-repeat
        ${isLocked 
          ? 'opacity-100 cursor-default' 
          : 'cursor-grab active:cursor-grabbing hover:shadow-2xl'}
        shadow-lg rounded-2xl
        ${!isLocked && 'hover:shadow-xl'}
      `}
      style={{
        ...getEdgeStyle(),
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${difficulty === 'easy' ? '322%' : 
                         difficulty === 'medium' ? '300%' : '320%'}`,
        backgroundPosition: `${piece.col * 50}% ${piece.row * 50}%`,
        filter: isLocked 
          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.05)' 
          : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))'
      }}
    >
      {/* Glow effect for hover - ADHD friendly visual feedback */}
      {isHovered && !isLocked && (
        <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-2xl pointer-events-none" />
      )}

      {/* Edge highlights - kid-friendly colors */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        {piece.top !== 'flat' && (
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 
            ${piece.top === 'tab' ? 'bg-purple-400' : 'bg-cyan-400'} rounded-full animate-pulse-slow`} />
        )}
        {piece.right !== 'flat' && (
          <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 
            ${piece.right === 'tab' ? 'bg-purple-400' : 'bg-cyan-400'} rounded-full animate-pulse-slow`} />
        )}
        {piece.bottom !== 'flat' && (
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-5 
            ${piece.bottom === 'tab' ? 'bg-purple-400' : 'bg-cyan-400'} rounded-full animate-pulse-slow`} />
        )}
        {piece.left !== 'flat' && (
          <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 
            ${piece.left === 'tab' ? 'bg-purple-400' : 'bg-cyan-400'} rounded-full animate-pulse-slow`} />
        )}
      </div>
      
      {/* Kid-friendly piece number badge */}
      <div className={`
        absolute bottom-1 right-1 w-7 h-7 
        ${isLocked ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} 
        rounded-full flex items-center justify-center text-white text-sm font-bold z-10 shadow-md
      `}>
        <span className="text-base">{getKidFriendlyNumber()}</span>
      </div>
      
      {/* Lock indicator with sparkle for locked pieces */}
      {isLocked && (
        <div className="absolute top-1 left-1 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-1.5 rounded-full z-10 shadow-md">
          <Lock className="w-3 h-3" />
        </div>
      )}
      
      {/* Cute drag handle indicator for unlocked pieces */}
      {!isLocked && (
        <div className="absolute top-1 left-1 w-6 h-6 bg-white bg-opacity-70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <Hand className="w-3 h-3 text-purple-600" />
        </div>
      )}

      {/* Sparkle animation for unlocked pieces on hover */}
      {!isLocked && isHovered && (
        <div className="absolute -top-4 -right-4 animate-twinkle">
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
      )}

      {/* Instructions for dragging */}
      {!isLocked && !isHovered && (
        <div className="absolute bottom-1 left-1 text-[8px] text-white bg-black bg-opacity-40 rounded-full px-1.5 py-0.5">
          ⬌
        </div>
      )}

      {/* Fun fact about piece position */}
      {!isLocked && isHovered && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs rounded-full px-2 py-0.5 whitespace-nowrap z-20">
          <span className="flex items-center gap-1">
            {piece.row === 0 && piece.col === 0 && '⭐ Corner piece!'}
            {piece.row === 0 && piece.col !== 0 && piece.col !== (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3) && '📐 Top edge'}
            {piece.row === (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3) && piece.col === 0 && '📐 Left edge'}
            {!piece.row && !piece.col && '🧩 Puzzle piece'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Add CSS animations for twinkling
const styles = `
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  .animate-twinkle {
    animation: twinkle 0.5s ease-in-out;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default PuzzlePiece;