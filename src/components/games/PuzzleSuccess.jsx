// src/components/games/PuzzleSuccess.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Star, Sparkles, PartyPopper, Volume2, VolumeX } from 'lucide-react';

// Audio files - try multiple approaches
let celebrationAudioSrc;
try {
  // Try to import the audio file
  celebrationAudioSrc = require('../../assets/sounds/celebration.mp3');
} catch (e) {
  console.log('Audio import failed, using alternative path');
  celebrationAudioSrc = '/sounds/celebration.mp3';
}

// Child-friendly encouraging messages
const encouragingMessages = {
  easy: [
    "🎉 You're a puzzle superstar! 🌟",
    "🐱 Great job! The cat is so happy! 🐱",
    "🎈 Amazing! You did it! 🎈",
    "⭐ Puzzle master in the making! ⭐"
  ],
  medium: [
    "🎊 Woohoo! You're a puzzle champion! 🎊",
    "🐶 The dog is wagging its tail with joy! 🐶",
    "🏆 Incredible puzzle skills! 🏆",
    "🌟 You're getting so good at this! 🌟"
  ],
  hard: [
    "🎉 Moo-velous job! You're a puzzle legend! 🎉",
    "👑 You're the puzzle king/queen! 👑",
    "🏅 Amazing! You conquered the hard puzzle! 🏅",
    "✨ Brilliant work, puzzle master! ✨"
  ]
};

// Simple Web Audio API celebration sound (fallback if MP3 fails)
const playWebAudioCelebration = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a simple happy melody
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25];
    const durations = [0.2, 0.2, 0.2, 0.3, 0.2, 0.2, 0.4];
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + durations[i]);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + durations[i]);
      }, i * 150);
    });
    
    // Add a little "ding" at the end
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 1318.52;
      osc.type = 'sine';
      gain.gain.value = 0.25;
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }, notes.length * 150 + 100);
    
    setTimeout(() => audioCtx.close(), 3000);
  } catch (error) {
    console.log('Web Audio error:', error);
  }
};

// Simple beep for button feedback
const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
    
    setTimeout(() => audioCtx.close(), 200);
  } catch (error) {
    console.log('Beep error:', error);
  }
};

const PuzzleSuccess = ({ 
  difficulty, 
  onPlayAgain, 
  onNextLevel, 
  imageUrl,
  completionTime,
  tryAgainCount,
  formatTime
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioSupported, setAudioSupported] = useState(true);
  const [webAudioUsed, setWebAudioUsed] = useState(false);
  const celebrationAudioRef = useRef(null);
  const soundPlayedRef = useRef(false);
  const confettiContainerRef = useRef(null);

  // Initialize audio on mount
  useEffect(() => {
    // Check if audio is supported
    const audio = new Audio();
    if (!audio.canPlayType('audio/mpeg')) {
      console.log('MP3 not supported, will use Web Audio fallback');
      setAudioSupported(false);
    }

    // Try to load MP3 audio
    if (celebrationAudioSrc && audioSupported) {
      try {
        celebrationAudioRef.current = new Audio();
        celebrationAudioRef.current.src = typeof celebrationAudioSrc === 'string' 
          ? celebrationAudioSrc 
          : celebrationAudioSrc.default || celebrationAudioSrc;
        celebrationAudioRef.current.preload = 'auto';
        celebrationAudioRef.current.volume = 0.35;
        celebrationAudioRef.current.loop = false;
        
        // Test if audio can play
        celebrationAudioRef.current.addEventListener('canplaythrough', () => {
          console.log('Audio ready to play');
        });
        
        celebrationAudioRef.current.addEventListener('error', (e) => {
          console.log('Audio load error, using Web Audio fallback', e);
          setAudioSupported(false);
        });
      } catch (error) {
        console.log('Audio initialization error:', error);
        setAudioSupported(false);
      }
    } else {
      setAudioSupported(false);
    }

    // Start celebration effects
    startCelebration();

    // Play celebration sound
    if (soundEnabled && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playCelebration();
    }

    return () => {
      // Cleanup audio
      if (celebrationAudioRef.current) {
        celebrationAudioRef.current.pause();
        celebrationAudioRef.current = null;
      }
      
      // Remove confetti container
      if (confettiContainerRef.current && document.body.contains(confettiContainerRef.current)) {
        document.body.removeChild(confettiContainerRef.current);
      }
    };
  }, []);

  const playCelebration = () => {
    if (!soundEnabled) return;
    
    // Try MP3 first if supported, otherwise use Web Audio
    if (audioSupported && celebrationAudioRef.current) {
      try {
        celebrationAudioRef.current.currentTime = 0;
        const playPromise = celebrationAudioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('MP3 play failed, using Web Audio fallback', error);
            setWebAudioUsed(true);
            playWebAudioCelebration();
          });
        }
      } catch (error) {
        console.log('MP3 error, using Web Audio fallback', error);
        setWebAudioUsed(true);
        playWebAudioCelebration();
      }
    } else {
      // Use Web Audio API as fallback
      setWebAudioUsed(true);
      playWebAudioCelebration();
    }
  };

  const startCelebration = () => {
    // Create confetti and balloons container
    const container = document.createElement('div');
    container.className = 'celebration-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    `;
    document.body.appendChild(container);
    confettiContainerRef.current = container;

    // Create colorful confetti
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#32CD32', '#1E90FF', '#FF1493', '#8B5CF6', '#EC4899'];
    
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      const size = 8 + Math.random() * 12;
      
      confetti.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: -20px;
        width: ${size}px;
        height: ${size * 1.5}px;
        background: ${color};
        opacity: 0.9;
        transform: rotate(${Math.random() * 360}deg);
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettiFall ${duration}s linear ${delay}s infinite;
      `;
      container.appendChild(confetti);
    }

    // Add floating balloons
    for (let i = 0; i < 8; i++) {
      const balloon = document.createElement('div');
      const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const left = 10 + Math.random() * 80;
      const delay = Math.random() * 2;
      
      balloon.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: -50px;
        width: 40px;
        height: 50px;
        background: ${color};
        border-radius: 50% 50% 50% 50%;
        opacity: 0.7;
        animation: floatUp ${3 + Math.random() * 2}s ease-in ${delay}s infinite;
        box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1);
      `;
      
      // Add balloon string
      const string = document.createElement('div');
      string.style.cssText = `
        position: absolute;
        left: 18px;
        top: 48px;
        width: 2px;
        height: 30px;
        background: #8B4513;
      `;
      balloon.appendChild(string);
      
      container.appendChild(balloon);
    }
  };

  const toggleSound = () => {
    if (soundEnabled && celebrationAudioRef.current) {
      celebrationAudioRef.current.pause();
      celebrationAudioRef.current.currentTime = 0;
    }
    setSoundEnabled(!soundEnabled);
  };

  const handlePlayAgain = () => {
    if (soundEnabled) playBeep();
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.pause();
      celebrationAudioRef.current.currentTime = 0;
    }
    onPlayAgain();
  };

  const handleNextLevel = () => {
    if (soundEnabled) playBeep();
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.pause();
      celebrationAudioRef.current.currentTime = 0;
    }
    onNextLevel();
  };

  // Get random encouraging message based on difficulty
  const getRandomMessage = () => {
    const messages = encouragingMessages[difficulty];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const titles = {
    easy: "🎉 You Did It! 🎉",
    medium: "🎊 Amazing! 🎊",
    hard: "👑 Champion! 👑"
  };

  const prizes = {
    easy: "🐱",
    medium: "🐶",
    hard: "🐮"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
      >
        {/* Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
        </button>

        {/* Audio indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-1">
          {soundEnabled && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">
                {webAudioUsed ? '🎵 Celebration!' : '🎵 Music!'}
              </span>
            </>
          )}
          {!soundEnabled && (
            <span className="text-xs text-gray-400">🔇 Muted</span>
          )}
        </div>

        {/* Animated background circles */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-300 rounded-full opacity-30"
        />

        {/* Animated Trophy with Bounce */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Congratulations Title */}
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3"
        >
          {titles[difficulty]}
        </motion.h2>

        {/* Success Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <div className="text-5xl mb-2">{prizes[difficulty]}</div>
          <p className="text-xl text-purple-600 font-semibold">{getRandomMessage()}</p>
        </motion.div>

        {/* Completed Puzzle Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
          className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 mx-auto max-w-[280px]"
        >
          <img 
            src={imageUrl} 
            alt="Completed Puzzle" 
            className="w-full h-auto object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Puzzle+Complete';
            }}
          />
          
          {/* Success badges */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute top-2 right-2 bg-green-500 rounded-full p-2 shadow-lg"
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-2 left-2 bg-yellow-500 rounded-full p-2 shadow-lg"
          >
            <Star className="w-5 h-5 text-white fill-white" />
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl text-center shadow-md">
            <div className="text-2xl mb-1">🧩</div>
            <div className="text-2xl font-bold text-purple-600">
              {difficulty === 'easy' ? '4' : 
               difficulty === 'medium' ? '9' : '16'}
            </div>
            <div className="text-xs text-gray-600">Pieces</div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-200 p-3 rounded-xl text-center shadow-md">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-xl font-bold text-blue-600">
              {formatTime(completionTime || 0)}
            </div>
            <div className="text-xs text-gray-600">Time</div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-red-200 p-3 rounded-xl text-center shadow-md">
            <div className="text-2xl mb-1">🔄</div>
            <div className="text-2xl font-bold text-orange-600">
              {tryAgainCount}
            </div>
            <div className="text-xs text-gray-600">Tries</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAgain}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 font-bold text-lg flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Play Again
          </motion.button>
          
          {difficulty !== 'hard' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextLevel}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 font-bold text-lg flex items-center justify-center shadow-lg"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              Next Level →
            </motion.button>
          )}
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-6 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl"
        >
          <p className="text-gray-700 text-sm flex items-center justify-center gap-2">
            <span>💡</span>
            {difficulty === 'easy' && `You're ready for more challenging puzzles! Try Medium next! 🌟`}
            {difficulty === 'medium' && `One more level to become a puzzle champion! 🏆`}
            {difficulty === 'hard' && `You're a true puzzle master! Amazing brain power! 🧠✨`}
          </p>
        </motion.div>
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .celebration-container {
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PuzzleSuccess;