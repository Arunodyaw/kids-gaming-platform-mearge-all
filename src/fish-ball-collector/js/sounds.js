// Function to create a beep sound
function createBeepSound(audioContext, frequency, duration, type) {
    return {
        play: function() {
            const gs = window.gameState;
            if (!gs.soundEnabled) return;
            
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                if (Array.isArray(frequency)) {
                    oscillator.frequency.setValueAtTime(frequency[0], audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(frequency[1], audioContext.currentTime + duration/2);
                    oscillator.frequency.exponentialRampToValueAtTime(frequency[2], audioContext.currentTime + duration);
                } else {
                    oscillator.frequency.value = frequency;
                }
                
                oscillator.type = type || 'sine';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.log("Sound play error:", e);
            }
        }
    };
}

// Function to create a celebration sound (fanfare)
function createCelebrationSound(audioContext) {
    return {
        play: function() {
            const gs = window.gameState;
            if (!gs.soundEnabled) return;
            
            try {
                const times = [0, 0.1, 0.2, 0.3, 0.4];
                const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                
                times.forEach((time, index) => {
                    setTimeout(() => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                        
                        oscillator.frequency.value = frequencies[index];
                        oscillator.type = 'sine';
                        
                        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                        
                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(audioContext.currentTime + 0.5);
                    }, time * 1000);
                });
            } catch (e) {
                console.log("Celebration sound error:", e);
            }
        }
    };
}

// Create simple beep sounds
window.createSounds = function() {
    const gs = window.gameState;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create all sound effects
        gs.sounds.collectBlue = createBeepSound(audioContext, 600, 0.2, 'sine');
        gs.sounds.collectGreen = createBeepSound(audioContext, 800, 0.2, 'sine');
        gs.sounds.collectRed = createBeepSound(audioContext, 400, 0.3, 'sawtooth');
        gs.sounds.gameOver = createBeepSound(audioContext, 300, 0.5, 'sine');
        gs.sounds.celebration = createCelebrationSound(audioContext);
        gs.sounds.levelUp = createBeepSound(audioContext, [800, 1000, 1200], 0.4, 'sine');
        gs.sounds.bubble = createBeepSound(audioContext, [200, 400, 200], 0.3, 'sine');
        
    } catch (e) {
        console.log("Audio not supported, continuing without sounds");
        gs.soundEnabled = false;
    }
};