// src/components/games/JigsawPuzzle.jsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import apiService from '../../../backend/src/services/api';
import PuzzleBoard from './PuzzleBoard';
import PuzzlePiece from './PuzzlePiece';
import PuzzleControls from './PuzzleControls';
import PuzzleSuccess from './PuzzleSuccess';
import FeedbackMessage from './FeedbackMessage';
import { generatePuzzleGrid, shuffleArray, createPuzzlePieces } from '../../utils/puzzleUtils';
import { saveGameStats } from '../../utils/puzzleReportUtils';
import { MousePointer, MapPin } from 'lucide-react';

// ADHD-friendly images with cute themes
const puzzleImages = {
  easy: {
    url: 'https://img.pikbest.com/png-images/20250429/cute-baby-cat-clipart-with-transparent-background_11689513.png!sw800',
    title: 'Happy Cat',
    colors: 'from-orange-200 to-yellow-100',
    bgPattern: '🐱',
    welcomeMessage: '🐱 Meow! Let\'s solve the cat puzzle! 🐱'
  },
  medium: {
    url: 'https://imgproxy.fourthwall.com/FouLUU3ZmIPw2589cKmPPYEe3Pi21yJNIuaFW9XpfAg/w:1920/sm:1/enc/pdY3SnQCnzFhqWY3/hpEkFEylKuuDsnGR/saiCOZACV32A-DoG/ssoapcPHDMElASUQ/M3zfB2t39jLtCE7A/U2Qx2FOALkm-JfAW/FgPsTAPW2BW-Kxss/V4DBd7VzdR_VbaBa/HgKNCiSp5a2poLYl/y5XvRdMSQIt3zlJc/mY3nvXPS2djTgnIJ/uE6AZ4TArj7YVN_9/2Wb-1-TmpAZzs-sM/lnYoqQ',
    title: 'Playful Dog',
    colors: 'from-blue-200 to-cyan-100',
    bgPattern: '🐶',
    welcomeMessage: '🐶 Woof! Time to play with the dog puzzle! 🐶'
  },
  hard: {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMd6KXcZh26Cy7IhEgnx6knj9St0AYTmW-DA&s',
    title: 'Farm Friends',
    colors: 'from-green-200 to-emerald-100',
    bgPattern: '🐮',
    welcomeMessage: '🐮 Moo! Let\'s build the farm puzzle! 🐷🐔'
  }
};

// Gentle, child-friendly sound effects using Web Audio API
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  async init() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.audioContext.resume();
    } catch (error) {
      console.log('Audio not supported');
      this.enabled = false;
    }
  }

  async playSound(type, volume = 0.25) {
    if (!this.enabled) return;
    
    try {
      await this.init();
      if (!this.audioContext || this.audioContext.state !== 'running') return;
      
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(this.audioContext.destination);
      
      switch(type) {
        case 'correct':
          this.playTone(523.25, 'sine', 0.25, gainNode);
          setTimeout(() => this.playTone(659.25, 'sine', 0.2, gainNode), 150);
          break;
          
        case 'incorrect':
          const osc = this.audioContext.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = 440;
          osc.connect(gainNode);
          osc.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.3);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.4);
          osc.start();
          osc.stop(this.audioContext.currentTime + 0.4);
          break;
          
        case 'complete':
          const notes = [523.25, 659.25, 783.99, 523.25];
          notes.forEach((freq, i) => {
            setTimeout(() => {
              this.playTone(freq, 'sine', 0.3, gainNode);
            }, i * 150);
          });
          break;
          
        case 'click':
          this.playTone(880, 'sine', 0.1, gainNode);
          break;
          
        case 'pieceLock':
          this.playTone(698.46, 'sine', 0.2, gainNode);
          break;
          
        case 'cheer':
          const cheerNotes = [523.25, 659.25];
          cheerNotes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.25, gainNode), i * 100);
          });
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.log('Sound error:', error);
    }
  }

  playTone(frequency, type, duration, gainNode) {
    if (!this.audioContext || this.audioContext.state !== 'running') return;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    oscillator.start();
    
    const gainNodeCopy = gainNode;
    gainNodeCopy.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}

const soundManager = new SoundManager();

// Encouraging messages for kids
const encouragingMessages = [
  "🎉 Great job!",
  "🌟 You're doing amazing!",
  "⭐ Keep going!",
  "✨ So smart!",
  "🌈 You've got this!",
  "🎈 Wonderful!",
  "🍭 Fantastic!",
  "🧸 You're a puzzle star!"
];

const JigsawPuzzle = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const audioEnabledRef = useRef(true);
  const gameStartedRef = useRef(false);
  
  // Child selection state
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  
  // Game state
  const [difficulty, setDifficulty] = useState('easy');
  const [pieces, setPieces] = useState([]);
  const [boardPieces, setBoardPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [completionTime, setCompletionTime] = useState(null);
  
  // Try Again counter
  const [tryAgainCount, setTryAgainCount] = useState(0);
  
  // Encouragement message
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [showEncouragement, setShowEncouragement] = useState(false);
  
  // Mouse tracking states
  const [mousePath, setMousePath] = useState([]);
  const [mouseSpeed, setMouseSpeed] = useState([]);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [lastMouseTime, setLastMouseTime] = useState(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const [lastPlacedPiece, setLastPlacedPiece] = useState(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState([]);
  
  // Loading state for API calls
  const [isSaving, setIsSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStars, setShowStars] = useState(false);

  // Initialize sound on first user interaction
  const initAudio = useCallback(async () => {
    if (audioEnabledRef.current) {
      await soundManager.init();
    }
  }, []);

  // Load children on component mount
  useEffect(() => {
    loadChildren();
  }, []);

  // Show random encouragement every 30 seconds
  useEffect(() => {
    let encouragementTimer;
    if (gameStarted && !completed) {
      encouragementTimer = setInterval(() => {
        if (pieces.filter(p => p.isPlaced).length > 0) {
          const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
          setEncouragementMessage(randomMessage);
          setShowEncouragement(true);
          setTimeout(() => setShowEncouragement(false), 2500);
        }
      }, 30000);
    }
    return () => clearInterval(encouragementTimer);
  }, [gameStarted, completed, pieces]);

  const loadChildren = async () => {
    try {
      setLoadingChildren(true);
      const response = await apiService.getChildren();
      if (response.success && response.data.length > 0) {
        setChildren(response.data);
        setSelectedChild(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoadingChildren(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && !completed && startTime) {
      timer = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, completed, startTime]);

  // Mouse tracking effect for path length and points only
  useEffect(() => {
    if (!gameStarted || completed) return;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const currentPos = { x: e.clientX, y: e.clientY };

      // Record path points
      setMousePath(prev => [...prev, { 
        x: e.clientX, 
        y: e.clientY, 
        timestamp: currentTime 
      }]);

      // Calculate raw speed (stored but not displayed)
      if (lastMousePosition && lastMouseTime) {
        const dx = currentPos.x - lastMousePosition.x;
        const dy = currentPos.y - lastMousePosition.y;
        const dt = currentTime - lastMouseTime;
        
        if (dt > 0) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = distance / dt;
          setMouseSpeed(prev => [...prev, speed]);
        }
      }

      setLastMousePosition(currentPos);
      setLastMouseTime(currentTime);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameStarted, completed, lastMousePosition, lastMouseTime]);

  // Initialize game when difficulty changes
  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  const initializeGame = (level) => {
    const { rows, cols } = generatePuzzleGrid(level);
    const allPieces = createPuzzlePieces(puzzleImages[level].url, rows, cols);
    
    const board = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        board.push({
          id: `board-${row}-${col}`,
          row,
          col,
          piece: null,
          isLocked: false
        });
      }
    }
    
    const shuffledPieces = shuffleArray(allPieces).map(piece => ({
      ...piece,
      isPlaced: false,
      isLocked: false,
      currentX: Math.random() * 200 + 50,
      currentY: Math.random() * 200 + 50
    }));
    
    setPieces(shuffledPieces);
    setBoardPieces(board);
    setCompleted(false);
    setShowSuccess(false);
    setGameStarted(true);
    setIncorrectAttempts([]);
    setLastPlacedPiece(null);
    setTryAgainCount(0);
    setStartTime(Date.now());
    setCurrentTime(0);
    setCompletionTime(null);
    setIsSaving(false);
    setShowCelebration(false);
    
    // Reset mouse tracking
    setMousePath([]);
    setMouseSpeed([]);
    setLastMousePosition(null);
    setLastMouseTime(null);
    
    if (audioEnabledRef.current) {
      soundManager.playSound('click', 0.15);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 1500);
  };

  const checkPieceFit = (piece, boardPosition) => {
    if (!piece || !boardPosition) return false;
    if (boardPosition.piece || boardPosition.isLocked) return false;
    return piece.row === boardPosition.row && piece.col === boardPosition.col;
  };

  const calculateMouseMetrics = () => {
    const avgSpeed = mouseSpeed.length > 0
      ? mouseSpeed.reduce((a, b) => a + b, 0) / mouseSpeed.length
      : 0;

    let totalPathLength = 0;
    for (let i = 1; i < mousePath.length; i++) {
      const prev = mousePath[i - 1];
      const curr = mousePath[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      totalPathLength += Math.sqrt(dx * dx + dy * dy);
    }

    let speedVariance = 0;
    if (mouseSpeed.length > 1) {
      const mean = mouseSpeed.reduce((a, b) => a + b, 0) / mouseSpeed.length;
      speedVariance = mouseSpeed.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / mouseSpeed.length;
    }

    return {
      avgSpeed: avgSpeed * 1000,
      totalPathLength,
      totalPoints: mousePath.length,
      speedVariance,
      avgSpeedRaw: avgSpeed,
      mousePath: mousePath.slice(-100)
    };
  };

  const saveToBackend = async (timeTaken, mouseMetrics) => {
    if (!selectedChild) return;

    setIsSaving(true);
    try {
      const gameData = {
        childId: selectedChild,
        difficulty,
        pieces: difficulty === 'easy' ? 4 : difficulty === 'medium' ? 9 : 16,
        timeCompleted: timeTaken,
        tryAgainCount: tryAgainCount,
        mouseData: {
          mousePath: mousePath.slice(-100)
        }
      };
      
      await apiService.saveGameSession(gameData);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const showPlacementCelebration = () => {
    setShowStars(true);
    setTimeout(() => setShowStars(false), 800);
  };

  const handleDropOnBoard = async (pieceId, boardId) => {
    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      await initAudio();
    }

    const piece = pieces.find(p => p.id === pieceId);
    const boardPos = boardPieces.find(b => b.id === boardId);
    
    if (!piece || !boardPos) return;
    if (piece.isLocked) return;
    
    if (checkPieceFit(piece, boardPos)) {
      const updatedPieces = pieces.map(p => 
        p.id === pieceId ? { 
          ...p, 
          isPlaced: true, 
          isLocked: true,
          currentX: 0, 
          currentY: 0 
        } : p
      );
      
      const updatedBoard = boardPieces.map(b => 
        b.id === boardId ? { 
          ...b, 
          piece: pieceId,
          isLocked: true
        } : b
      );
      
      setPieces(updatedPieces);
      setBoardPieces(updatedBoard);
      setLastPlacedPiece(pieceId);
      
      showPlacementCelebration();
      
      if (audioEnabledRef.current) {
        soundManager.playSound('correct', 0.25);
        setTimeout(() => soundManager.playSound('pieceLock', 0.2), 150);
      }
      
      showFeedback('success', '✨ Great Job! ✨');
      
      const allPlaced = updatedPieces.every(p => p.isPlaced);
      if (allPlaced) {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        setCompletionTime(timeTaken);
        
        const mouseMetrics = calculateMouseMetrics();
        
        saveGameStats(difficulty, timeTaken, tryAgainCount, mouseMetrics);
        saveToBackend(timeTaken, mouseMetrics);
        
        if (audioEnabledRef.current) {
          soundManager.playSound('complete', 0.35);
          soundManager.playSound('cheer', 0.3);
        }
        
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        
        setCompleted(true);
        setShowSuccess(true);
      } else {
        const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setEncouragementMessage(randomMessage);
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 2000);
      }
    } else {
      setTryAgainCount(prev => prev + 1);
      setIncorrectAttempts(prev => [...prev, { pieceId, boardId, time: Date.now() }]);
      
      if (audioEnabledRef.current) {
        soundManager.playSound('incorrect', 0.2);
      }
      
      showFeedback('error', '🤔 Try Again! 🤔');
      
      setTimeout(() => {
        setIncorrectAttempts(prev => 
          prev.filter(attempt => attempt.time !== Date.now())
        );
      }, 1000);
    }
  };

  const handleRemoveFromBoard = (boardId) => {
    const boardPos = boardPieces.find(b => b.id === boardId);
    if (!boardPos || !boardPos.piece) return;
    
    const pieceId = boardPos.piece;
    const piece = pieces.find(p => p.id === pieceId);
    
    if (piece?.isLocked) {
      showFeedback('info', '🔒 This piece is locked! 🔒');
      return;
    }
    
    const updatedPieces = pieces.map(p => 
      p.id === pieceId ? { 
        ...p, 
        isPlaced: false,
        isLocked: false,
        currentX: Math.random() * 200 + 50,
        currentY: Math.random() * 200 + 50
      } : p
    );
    
    const updatedBoard = boardPieces.map(b => 
      b.id === boardId ? { 
        ...b, 
        piece: null,
        isLocked: false 
      } : b
    );
    
    setPieces(updatedPieces);
    setBoardPieces(updatedBoard);
    showFeedback('info', '📦 Piece moved back');
  };

  const updatePiecePosition = (pieceId, x, y) => {
    setPieces(prev => prev.map(p => 
      p.id === pieceId && !p.isLocked ? { ...p, currentX: x, currentY: y } : p
    ));
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total path length for display
  const getTotalPathLength = () => {
    let total = 0;
    for (let i = 1; i < mousePath.length; i++) {
      const dx = mousePath[i].x - mousePath[i-1].x;
      const dy = mousePath[i].y - mousePath[i-1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(total);
  };

  const goToAddChild = () => {
    navigate('/add-child');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${puzzleImages[difficulty].colors} p-4 md:p-6 relative overflow-hidden`}>
      {/* Mouse Tracking Points Display Panel - Top Right */}
      {gameStarted && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 right-4 z-30 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl p-3 border-2 border-purple-200 min-w-[180px]"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1">
              <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <MousePointer className="w-3 h-3" />
                Mouse Tracking
              </span>
            </div>
            
            {/* Mouse Points Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 flex items-center gap-1">
                📍 Points:
              </span>
              <span className="text-sm font-bold text-purple-600">
                {mousePath.length}
              </span>
            </div>
            
            {/* Path Length */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Path Length:
              </span>
              <span className="text-sm font-bold text-blue-600">
                {getTotalPathLength()} px
              </span>
            </div>
            
            {/* Simple Interpretation */}
            {mousePath.length > 0 && (
              <div className="mt-1 pt-1 border-t border-gray-200 text-center">
                <span className="text-[10px] text-gray-400">
                  {mousePath.length < 50 ? '🎯 Just getting started!' : 
                   mousePath.length < 200 ? '📈 Making progress!' : 
                   '✨ You\'re moving around a lot!'}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Star Burst Effect */}
      <AnimatePresence>
        {showStars && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed pointer-events-none z-50"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="text-5xl">⭐✨🌟⭐</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement Popup */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-2xl z-40 border-2 border-purple-300"
          >
            <span className="text-purple-700 font-bold text-lg">{encouragementMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="text-8xl animate-bounce">🎉✨🎊🌟</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0.2 }}
            animate={{ y: '-20vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            transition={{ duration: 10 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 10 }}
            className="absolute text-3xl"
          >
            {puzzleImages[difficulty].bgPattern}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3 flex-wrap"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="inline-block hover:scale-110 transition-transform cursor-pointer">🧩</span>
            <span className="bg-white bg-opacity-60 px-6 py-2 rounded-full shadow-lg">
              Puzzle Time!
            </span>
            <span className="inline-block hover:scale-110 transition-transform cursor-pointer">🧩</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-700 bg-white bg-opacity-50 inline-block px-6 py-2 rounded-full shadow-md"
          >
            {puzzleImages[difficulty].welcomeMessage}
          </motion.p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <span className="font-bold text-purple-600 text-lg">{formatTime(currentTime)}</span>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <span className="text-xl">🔄</span>
              <span className="font-bold text-orange-600 text-lg">{tryAgainCount}</span>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <span className="text-xl">🧩</span>
              <span className="font-bold text-green-600 text-lg">
                {pieces.filter(p => p.isPlaced).length}/{pieces.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Child Selector */}
        {children.length > 0 && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-6 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-purple-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👧🧒</span>
                <span className="text-gray-700 font-semibold">Who's playing?</span>
              </div>
              <select
                value={selectedChild || ''}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-semibold"
              >
                {children.map(child => (
                  <option key={child._id} value={child._id}>
                    🌟 {child.childName} {child.childAge && `(${child.childAge} years)`}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* No Children Message */}
        {!loadingChildren && children.length === 0 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-400 rounded-2xl p-6 text-center shadow-xl"
          >
            <div className="text-6xl mb-3 animate-bounce">🎮✨👋</div>
            <p className="text-yellow-800 text-xl mb-3 font-bold">Let's create your player profile!</p>
            <p className="text-yellow-700 mb-6">Add a child to start playing and tracking your puzzle adventures! 🧩🌟</p>
          </motion.div>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PuzzleControls
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onReset={() => initializeGame(difficulty)}
              gameStarted={gameStarted}
              piecesPlaced={pieces.filter(p => p.isPlaced).length}
              totalPieces={pieces.length}
              currentTime={currentTime}
              tryAgainCount={tryAgainCount}
              formatTime={formatTime}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <PuzzleBoard
              boardPieces={boardPieces}
              pieces={pieces}
              onDrop={handleDropOnBoard}
              onRemove={handleRemoveFromBoard}
              difficulty={difficulty}
              imageUrl={puzzleImages[difficulty].url}
              lastPlacedPiece={lastPlacedPiece}
              incorrectAttempts={incorrectAttempts}
            />

            {/* Available Pieces */}
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-4 border-2 border-white">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <motion.span 
                  className="text-2xl inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🧩
                </motion.span>
                Pieces to Place ({pieces.filter(p => !p.isPlaced && !p.isLocked).length})
              </h3>
              
              <div className="flex flex-wrap gap-4 min-h-[150px] p-4 bg-white bg-opacity-40 rounded-xl">
                <AnimatePresence>
                  {pieces
                    .filter(p => !p.isPlaced && !p.isLocked)
                    .map((piece, index) => (
                      <PuzzlePiece
                        key={piece.id}
                        piece={piece}
                        index={index}
                        onDrag={updatePiecePosition}
                        onDrop={handleDropOnBoard}
                        difficulty={difficulty}
                        imageUrl={puzzleImages[difficulty].url}
                        isLocked={false}
                      />
                    ))}
                </AnimatePresence>
                
                {pieces.filter(p => !p.isPlaced && !p.isLocked).length === 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full text-center py-8"
                  >
                    <div className="text-7xl mb-3 animate-bounce">🎉✨🏆</div>
                    <div className="text-green-600 font-bold text-2xl">You did it!</div>
                    <div className="text-gray-600 mt-2">You're a puzzle champion! 🌟</div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {feedback.show && (
            <FeedbackMessage type={feedback.type} message={feedback.message} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccess && (
            <PuzzleSuccess
              difficulty={difficulty}
              onPlayAgain={() => initializeGame(difficulty)}
              onNextLevel={() => {
                const nextLevel = 
                  difficulty === 'easy' ? 'medium' : 
                  difficulty === 'medium' ? 'hard' : 'easy';
                setDifficulty(nextLevel);
                if (audioEnabledRef.current) {
                  soundManager.playSound('cheer', 0.3);
                }
              }}
              imageUrl={puzzleImages[difficulty].url}
              completionTime={completionTime}
              tryAgainCount={tryAgainCount}
              formatTime={formatTime}
            />
          )}
        </AnimatePresence>

        {/* Kid-Friendly Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-4 border-2 border-purple-200"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-purple-200 px-4 py-2 rounded-full">
              <span className="text-2xl">1️⃣</span>
              <span className="font-medium">Pick a piece</span>
            </div>
            <span className="text-2xl">➡️</span>
            <div className="flex items-center gap-2 bg-blue-200 px-4 py-2 rounded-full">
              <span className="text-2xl">2️⃣</span>
              <span className="font-medium">Drag to its spot</span>
            </div>
            <span className="text-2xl">➡️</span>
            <div className="flex items-center gap-2 bg-green-200 px-4 py-2 rounded-full">
              <span className="text-2xl">3️⃣</span>
              <span className="font-medium">🎵 Hear the magic sound!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JigsawPuzzle;