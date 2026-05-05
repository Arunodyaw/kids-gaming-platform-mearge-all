// src/utils/puzzleUtils.js
export const generatePuzzleGrid = (difficulty) => {
  const gridSizes = {
    easy: { rows: 2, cols: 2, pieces: 4 },
    medium: { rows: 2, cols: 3, pieces: 6 },
    hard: { rows: 3, cols: 3, pieces: 9 }
  };
  
  return gridSizes[difficulty] || gridSizes.easy;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate tab/blind patterns for each piece edge
export const generateEdgePatterns = (rows, cols) => {
  const patterns = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = {
        id: `piece-${row}-${col}`,
        row,
        col,
        // Edge types: 'tab' (凸), 'blank' (凹), 'flat' (边缘)
        top: row === 0 ? 'flat' : Math.random() > 0.5 ? 'tab' : 'blank',
        right: col === cols - 1 ? 'flat' : Math.random() > 0.5 ? 'tab' : 'blank',
        bottom: row === rows - 1 ? 'flat' : Math.random() > 0.5 ? 'tab' : 'blank',
        left: col === 0 ? 'flat' : Math.random() > 0.5 ? 'tab' : 'blank'
      };
      
      // Ensure matching edges between adjacent pieces
      if (row > 0) {
        // Match with piece above
        const abovePiece = patterns.find(p => p.row === row - 1 && p.col === col);
        if (abovePiece) {
          piece.top = abovePiece.bottom === 'tab' ? 'blank' : 'tab';
        }
      }
      
      if (col > 0) {
        // Match with piece to the left
        const leftPiece = patterns.find(p => p.row === row && p.col === col - 1);
        if (leftPiece) {
          piece.left = leftPiece.right === 'tab' ? 'blank' : 'tab';
        }
      }
      
      patterns.push(piece);
    }
  }
  
  return patterns;
};

export const createPuzzlePieces = (imageUrl, rows, cols) => {
  const edgePatterns = generateEdgePatterns(rows, cols);
  
  return edgePatterns.map(pattern => ({
    ...pattern,
    imageUrl,
    width: 100 / cols,
    height: 100 / rows,
    backgroundPositionX: pattern.col * (100 / (cols - 1)),
    backgroundPositionY: pattern.row * (100 / (rows - 1)),
    isPlaced: false,
    currentX: 0,
    currentY: 0
  }));
};