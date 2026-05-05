// Initialize DOM references
function initDOMReferences() {
    const gs = window.gameState;
    
    gs.canvas = document.getElementById('gameCanvas');
    gs.ctx = gs.canvas.getContext('2d');
    gs.scoreElement = document.getElementById('score');
    gs.ballsCollectedElement = document.getElementById('ballsCollected');
    gs.redBallCounters = [
        document.getElementById('redBall1'),
        document.getElementById('redBall2'),
        document.getElementById('redBall3')
    ];
    gs.gameOverScreen = document.getElementById('gameOver');
    gs.finalScoreElement = document.getElementById('finalScore');
    gs.messagesContainer = document.getElementById('messagesContainer');
    
    // Initialize fish
    gs.fish = {
        x: gs.canvas.width / 2,
        y: gs.canvas.height / 2,
        width: 80,
        height: 60,
        speed: 5,
        color: '#FF6B9D',
        tailAngle: 0,
        mouthAngle: 0,
        eyeAngle: 0,
        finAngle: 0,
        direction: 1,
        happy: false,
        happyTimer: 0
    };
    
    gs.mouseX = gs.canvas.width / 2;
    gs.mouseY = gs.canvas.height / 2;
    
    // Background themes initialization
    gs.backgroundThemes = [
        { type: 'image', id: 'fish_tank_bg', src: 'assets/fish_tank_bg.png' },
        { type: 'image', id: 'sea_bg', src: 'assets/sea_bg.png' },
        { type: 'image', id: 'lake_bg', src: 'assets/lake_bg.png' },
        { type: 'image', id: 'pond_bg', src: 'assets/pond_bg.png' },
        { type: 'gradient', top: '#023047', bottom: '#219ebc', bubble: 'rgba(142, 202, 230, 0.2)', bubbleHighlight: 'rgba(142, 202, 230, 0.4)' }
    ];
    
    // Preload images
    if (!gs.bgImages) {
        gs.bgImages = {};
        gs.backgroundThemes.forEach(theme => {
            if (theme.type === 'image') {
                const img = new Image();
                img.src = theme.src;
                gs.bgImages[theme.id] = img;
            }
        });
    }
    
    let savedTheme = sessionStorage.getItem('fishGameThemeIndex');
    gs.currentThemeIndex = savedTheme ? parseInt(savedTheme, 10) : 0;
}

// Create a new ball with QUARTER RED FREQUENCY
window.createBallWithQuarterRedFrequency = function() {
    const gs = window.gameState;
    let colorIndex;
    
    const randomValue = Math.random();
    
    if (randomValue < 4/9) {
        colorIndex = 0; // Blue
        gs.blueBallCount++;
    } else if (randomValue < 8/9) {
        colorIndex = 1; // Green
        gs.greenBallCount++;
    } else {
        colorIndex = 2; // Red
        gs.redBallCount++;
    }
    
    const x = Math.random() * (gs.canvas.width - gs.ballRadius * 4) + gs.ballRadius * 2;
    const y = Math.random() * (gs.canvas.height - gs.ballRadius * 4) + gs.ballRadius * 2;
    
    const speed = 1 + Math.random() * 2;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    gs.balls.push({
        x,
        y,
        vx,
        vy,
        color: gs.ballColors[colorIndex],
        colorIndex,
        radius: gs.ballRadius
    });
    
    return colorIndex;
};

// Initialize game
function init() {
    const gs = window.gameState;
    
    gs.score = 0;
    gs.ballsCollected = 0;
    gs.redBallsTouched = 0;
    gs.balls = [];
    gs.ballSpawnTimer = 0;
    gs.lastCelebrationScore = 0;
    gs.particles = [];
    gs.blueBallCount = 0;
    gs.greenBallCount = 0;
    gs.redBallCount = 0;
    
    // Clear any existing messages and particles
    if (gs.messagesContainer) {
        gs.messagesContainer.innerHTML = '';
    }
    document.querySelectorAll('.particle').forEach(p => p.remove());
    
    // Reset fish
    if (gs.fish && gs.canvas) {
        gs.fish.happy = false;
        gs.fish.happyTimer = 0;
        gs.fish.x = gs.canvas.width / 2;
        gs.fish.y = gs.canvas.height / 2;
        gs.fish.direction = 1;
        gs.fish.color = '#FF6B9D';
    }
    
    // Reset red ball counters
    if (gs.redBallCounters) {
        gs.redBallCounters.forEach(counter => {
            counter.classList.remove('touched');
            counter.textContent = '';
        });
    }
    
    // Update UI
    if (gs.scoreElement) gs.scoreElement.textContent = '0';
    if (gs.ballsCollectedElement) gs.ballsCollectedElement.textContent = '0';
    
    // Hide game over screen
    if (gs.gameOverScreen) {
        gs.gameOverScreen.style.display = 'none';
    }
    
    // Create initial balls
    for (let i = 0; i < 5; i++) {
        const colorIndex = window.createBallWithQuarterRedFrequency();
        const ball = gs.balls[gs.balls.length - 1];
        if (ball && window.gameTracker) {
            const colorNames = ['blue', 'green', 'red'];
            window.gameTracker.onBallSpawn(colorNames[colorIndex], { x: ball.x, y: ball.y });
        }
    }
}

// Start game
function startGame() {
    const gs = window.gameState;
    
    if (!gs.gameRunning) {
        init();
        gs.gameRunning = true;
        gs.gamePaused = false;
        
        // Track game start
        if (window.gameTracker) {
            window.gameTracker.onGameStart();
        }
        
        // Show welcome message in current language
        if (gs.canvas && window.systemMessages) {
            window.showMessage(
                window.systemMessages.gameStart[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        
        gameLoop();
    }
}

// Toggle pause
function togglePause() {
    const gs = window.gameState;
    
    if (!gs.gameRunning) return;
    
    gs.gamePaused = !gs.gamePaused;
    
    if (gs.gamePaused) {
        cancelAnimationFrame(gs.animationId);
        if (window.updateButtonTexts) window.updateButtonTexts();
        
        // Track pause
        if (window.gameTracker) {
            window.gameTracker.onPause();
        }
        
        if (gs.canvas && window.systemMessages) {
            window.showMessage(
                window.systemMessages.gamePaused[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        
        // Pause any speech
        if (gs.speechSynthesisSupported) {
            speechSynthesis.pause();
        }
    } else {
        if (window.updateButtonTexts) window.updateButtonTexts();
        
        // Track resume
        if (window.gameTracker) {
            window.gameTracker.onResume();
        }
        
        // Resume any speech
        if (gs.speechSynthesisSupported) {
            speechSynthesis.resume();
        }
        
        gameLoop();
    }
}

// Restart game
function restartGame() {
    const gs = window.gameState;
    
    cancelAnimationFrame(gs.animationId);
    gs.gameRunning = false;
    gs.gamePaused = false;
    if (window.updateButtonTexts) window.updateButtonTexts();
    startGame();
}

// Update UI
function updateUI() {
    const gs = window.gameState;
    
    if (gs.scoreElement) gs.scoreElement.textContent = gs.score;
    if (gs.ballsCollectedElement) gs.ballsCollectedElement.textContent = gs.ballsCollected;
    
    // Update red ball counters
    if (gs.redBallCounters) {
        for (let i = 0; i < gs.redBallCounters.length; i++) {
            if (i < gs.redBallsTouched) {
                gs.redBallCounters[i].classList.add('touched');
                gs.redBallCounters[i].textContent = 'X';
            } else {
                gs.redBallCounters[i].classList.remove('touched');
                gs.redBallCounters[i].textContent = '';
            }
        }
    }
    
    // Check for celebrations
    if (window.checkForCelebration) {
        window.checkForCelebration(gs.score);
    }
}

// Draw fish
function drawFish() {
    const gs = window.gameState;
    if (!gs.fish || !gs.ctx || !gs.canvas) return;
    
    gs.ctx.save();
    gs.ctx.translate(gs.fish.x, gs.fish.y);
    
    // Flip fish based on direction
    if (gs.fish.direction === -1) {
        gs.ctx.scale(-1, 1);
    }
    
    const isHappy = gs.fish.happy;
    
    // Draw fish body with gradient
    const bodyGradient = gs.ctx.createRadialGradient(
        0, 0, gs.fish.width/4,
        0, 0, gs.fish.width/2
    );
    
    if (isHappy) {
        bodyGradient.addColorStop(0, '#FFD700');
        bodyGradient.addColorStop(1, '#FFA500');
    } else {
        bodyGradient.addColorStop(0, gs.fish.color);
        bodyGradient.addColorStop(1, '#FF4081');
    }
    
    gs.ctx.fillStyle = bodyGradient;
    gs.ctx.beginPath();
    gs.ctx.ellipse(0, 0, gs.fish.width / 2, gs.fish.height / 2, 0, 0, Math.PI * 2);
    gs.ctx.fill();
    
    // Draw fish fins
    gs.ctx.fillStyle = '#FF4081';
    
    // Top fin
    gs.ctx.beginPath();
    gs.ctx.moveTo(0, -gs.fish.height/2);
    gs.ctx.quadraticCurveTo(20, -gs.fish.height/2 - 15, 0, -gs.fish.height/2 - 30);
    gs.ctx.quadraticCurveTo(-20, -gs.fish.height/2 - 15, 0, -gs.fish.height/2);
    gs.ctx.fill();
    
    // Side fin (animated)
    gs.ctx.save();
    gs.ctx.translate(-gs.fish.width/3, gs.fish.height/4);
    gs.ctx.rotate(Math.sin(gs.fish.finAngle) * 0.3);
    
    gs.ctx.beginPath();
    gs.ctx.moveTo(0, 0);
    gs.ctx.quadraticCurveTo(15, 5, 0, 20);
    gs.ctx.quadraticCurveTo(-15, 5, 0, 0);
    gs.ctx.fill();
    
    gs.ctx.restore();
    
    // Draw fish tail
    gs.ctx.fillStyle = '#FF4081';
    gs.ctx.beginPath();
    gs.ctx.moveTo(-gs.fish.width/2, 0);
    
    gs.ctx.bezierCurveTo(
        -gs.fish.width/2 - 40, -20,
        -gs.fish.width/2 - 20, -40,
        -gs.fish.width/2 + 10, -10
    );
    
    gs.ctx.bezierCurveTo(
        -gs.fish.width/2, 0,
        -gs.fish.width/2 - 20, 40,
        -gs.fish.width/2 - 40, 20
    );
    
    gs.ctx.bezierCurveTo(
        -gs.fish.width/2 - 20, 0,
        -gs.fish.width/2, 0,
        -gs.fish.width/2, 0
    );
    
    gs.ctx.fill();
    
    // Draw fish eye
    gs.ctx.fillStyle = 'white';
    gs.ctx.beginPath();
    gs.ctx.arc(gs.fish.width/4, -gs.fish.height/6, 10, 0, Math.PI * 2);
    gs.ctx.fill();
    
    // Draw eye pupil (animated)
    const pupilX = gs.fish.width/4 + Math.cos(gs.fish.eyeAngle) * 3;
    const pupilY = -gs.fish.height/6 + Math.sin(gs.fish.eyeAngle) * 3;
    
    gs.ctx.fillStyle = 'black';
    gs.ctx.beginPath();
    gs.ctx.arc(pupilX, pupilY, 5, 0, Math.PI * 2);
    gs.ctx.fill();
    
    // Draw eye sparkle
    gs.ctx.fillStyle = 'white';
    gs.ctx.beginPath();
    gs.ctx.arc(pupilX - 2, pupilY - 2, 2, 0, Math.PI * 2);
    gs.ctx.fill();
    
    // Draw fish mouth (smiling when happy)
    gs.ctx.strokeStyle = '#D84315';
    gs.ctx.lineWidth = 3;
    gs.ctx.beginPath();
    
    if (isHappy) {
        gs.ctx.arc(gs.fish.width/4, gs.fish.height/6, 12, 0.2, Math.PI - 0.2);
    } else {
        gs.ctx.arc(gs.fish.width/4, gs.fish.height/6, 8, 0, Math.PI);
    }
    
    gs.ctx.stroke();
    
    // Draw blush marks when happy
    if (isHappy) {
        gs.ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
        gs.ctx.beginPath();
        gs.ctx.arc(gs.fish.width/4 - 15, gs.fish.height/8, 6, 0, Math.PI * 2);
        gs.ctx.fill();
        
        gs.ctx.beginPath();
        gs.ctx.arc(gs.fish.width/4 + 5, gs.fish.height/8, 6, 0, Math.PI * 2);
        gs.ctx.fill();
    }
    
    gs.ctx.restore();
    
    // Animate fish parts
    gs.fish.tailAngle += 0.3;
    gs.fish.eyeAngle += 0.05;
    gs.fish.finAngle += 0.2;
    
    // Update happy timer
    if (gs.fish.happy && gs.fish.happyTimer > 0) {
        gs.fish.happyTimer--;
        if (gs.fish.happyTimer <= 0) {
            gs.fish.happy = false;
        }
    }
}

// Draw balls
function drawBalls() {
    const gs = window.gameState;
    if (!gs.ctx || !gs.balls) return;
    
    gs.balls.forEach(ball => {
        // Draw ball with shadow
        gs.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        gs.ctx.shadowBlur = 5;
        gs.ctx.shadowOffsetY = 2;
        
        gs.ctx.fillStyle = ball.color;
        gs.ctx.beginPath();
        gs.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        gs.ctx.fill();
        
        // Reset shadow
        gs.ctx.shadowBlur = 0;
        gs.ctx.shadowOffsetY = 0;
        
        // Draw ball highlight
        gs.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        gs.ctx.beginPath();
        gs.ctx.arc(ball.x - ball.radius/3, ball.y - ball.radius/3, ball.radius/3, 0, Math.PI * 2);
        gs.ctx.fill();
        
        // Draw a little sparkle on balls occasionally
        if (Math.random() < 0.01) {
            gs.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            gs.ctx.beginPath();
            gs.ctx.arc(ball.x + ball.radius/2, ball.y - ball.radius/2, 4, 0, Math.PI * 2);
            gs.ctx.fill();
        }
    });
}

// Update fish position
function updateFish() {
    const gs = window.gameState;
    if (!gs.fish || !gs.canvas) return;
    
    // Calculate direction to mouse
    const dx = gs.mouseX - gs.fish.x;
    const dy = gs.mouseY - gs.fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update fish direction (face toward mouse)
    if (dx > 0) {
        gs.fish.direction = 1;
    } else if (dx < 0) {
        gs.fish.direction = -1;
    }
    
    // Move fish toward mouse if it's far enough
    if (distance > 5) {
        gs.fish.x += (dx / distance) * gs.fish.speed;
        gs.fish.y += (dy / distance) * gs.fish.speed;
    }
    
    // Keep fish within canvas bounds
    gs.fish.x = Math.max(gs.fish.width/2, Math.min(gs.canvas.width - gs.fish.width/2, gs.fish.x));
    gs.fish.y = Math.max(gs.fish.height/2, Math.min(gs.canvas.height - gs.fish.height/2, gs.fish.y));
}

// Update balls position
function updateBalls() {
    const gs = window.gameState;
    if (!gs.fish || !gs.canvas || !gs.balls) return;
    
    for (let i = gs.balls.length - 1; i >= 0; i--) {
        const ball = gs.balls[i];
        
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Bounce off walls
        if (ball.x <= ball.radius || ball.x >= gs.canvas.width - ball.radius) {
            ball.vx = -ball.vx;
            ball.x = Math.max(ball.radius, Math.min(gs.canvas.width - ball.radius, ball.x));
        }
        if (ball.y <= ball.radius || ball.y >= gs.canvas.height - ball.radius) {
            ball.vy = -ball.vy;
            ball.y = Math.max(ball.radius, Math.min(gs.canvas.height - ball.radius, ball.y));
        }
        
        // Check collision with fish
        const dx = ball.x - gs.fish.x;
        const dy = ball.y - gs.fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + gs.fish.width/2) {
            // Collision detected
            const points = gs.ballPoints[ball.colorIndex];
            const colorNames = ['blue', 'green', 'red'];
            const ballColor = colorNames[ball.colorIndex];
            
            // Track ball collection
            if (window.gameTracker) {
                window.gameTracker.onBallCollected(ballColor, ball.colorIndex, { x: ball.x, y: ball.y });
            }
            
            // Update score and counters based on ball color
            if (ball.colorIndex === 2) { // Red ball
                gs.redBallsTouched++;
                
                // Track red ball hit
                if (window.gameTracker) {
                    window.gameTracker.onRedBallHit(gs.redBallsTouched, { x: ball.x, y: ball.y });
                }
                
                // Show red ball warning message
                if (window.redBallMessages && window.showMessage) {
                    const messages = window.redBallMessages[gs.currentLanguage];
                    const message = messages[Math.floor(Math.random() * messages.length)];
                    window.showMessage(message, "bad", ball.x, ball.y);
                }
                
                // Play sound
                if (gs.soundEnabled && gs.sounds.collectRed) {
                    gs.sounds.collectRed.play();
                }
                
                // Game over after 3 red balls
                if (gs.redBallsTouched >= gs.MAX_RED_BALLS) {
                    gameOver();
                    return;
                }
            } else {
                gs.ballsCollected++;
                
                // Play sound for blue or green balls
                if (gs.soundEnabled) {
                    if (ball.colorIndex === 0 && gs.sounds.collectBlue) {
                        gs.sounds.collectBlue.play();
                    } else if (ball.colorIndex === 1 && gs.sounds.collectGreen) {
                        gs.sounds.collectGreen.play();
                    }
                }
            }
            
            gs.score += points;
            
            // Track score change
            if (window.gameTracker) {
                window.gameTracker.onScoreChange(gs.score, points, ballColor);
            }
            
            // Remove the ball
            gs.balls.splice(i, 1);
            
            // Update UI
            updateUI();
        }
    }
    
    // Spawn new balls
    gs.ballSpawnTimer++;
    if (gs.ballSpawnTimer >= gs.ballSpawnInterval) {
        const colorIndex = window.createBallWithQuarterRedFrequency();
        const ball = gs.balls[gs.balls.length - 1];
        if (ball && window.gameTracker) {
            const colorNames = ['blue', 'green', 'red'];
            window.gameTracker.onBallSpawn(colorNames[colorIndex], { x: ball.x, y: ball.y });
        }
        gs.ballSpawnTimer = 0;
        
        // Randomly spawn extra balls occasionally
        if (Math.random() < 0.3) {
            const colorIndex2 = window.createBallWithQuarterRedFrequency();
            const ball2 = gs.balls[gs.balls.length - 1];
            if (ball2 && window.gameTracker) {
                const colorNames = ['blue', 'green', 'red'];
                window.gameTracker.onBallSpawn(colorNames[colorIndex2], { x: ball2.x, y: ball2.y });
            }
        }
    }
}

// Game over function
function gameOver() {
    const gs = window.gameState;
    
    gs.sessionCompleted = true;
    
    // Increment the theme index for the next session
    if (gs.backgroundThemes) {
        gs.currentThemeIndex = (gs.currentThemeIndex + 1) % gs.backgroundThemes.length;
        sessionStorage.setItem('fishGameThemeIndex', gs.currentThemeIndex.toString());
    }
    
    gs.gameRunning = false;
    cancelAnimationFrame(gs.animationId);
    
    // Calculate game duration
    const duration = window.gameTracker && window.gameTracker.gameStartTime 
        ? Date.now() - window.gameTracker.gameStartTime 
        : 0;
    
    // Track game over
    if (window.gameTracker) {
        window.gameTracker.onGameOver(gs.score, gs.redBallsTouched, gs.ballsCollected, duration);
    }
    
    // Play game over sound
    if (gs.soundEnabled && gs.sounds.gameOver) {
        gs.sounds.gameOver.play();
    }
    
    // Show final message
    if (gs.canvas && window.systemMessages && window.showMessage) {
        window.showMessage(
            window.systemMessages.gameOver[gs.currentLanguage], 
            "bad", 
            gs.canvas.width/2, 
            gs.canvas.height/2
        );
    }
    
    // Update final score
    if (gs.finalScoreElement) {
        gs.finalScoreElement.textContent = `Final Score: ${gs.score} / අවසාන ලකුණු: ${gs.score}`;
    }
    
    // Show game over screen after a delay
    setTimeout(() => {
        if (gs.gameOverScreen) {
            gs.gameOverScreen.style.display = 'block';
        }
    }, 1000);
}

// Draw water background
function drawWaterBackground() {
    const gs = window.gameState;
    if (!gs.ctx || !gs.canvas) return;
    
    // Default fallback if themes are not set yet
    const theme = gs.backgroundThemes ? gs.backgroundThemes[gs.currentThemeIndex] : {
        type: 'gradient',
        top: '#0a3d91', bottom: '#1e7bc0', 
        bubble: 'rgba(255, 255, 255, 0.2)', 
        bubbleHighlight: 'rgba(255, 255, 255, 0.4)'
    };
    
    if (theme.type === 'image' && gs.bgImages && gs.bgImages[theme.id]) {
        const img = gs.bgImages[theme.id];
        if (img.complete && img.naturalHeight !== 0) {
            gs.ctx.drawImage(img, 0, 0, gs.canvas.width, gs.canvas.height);
        } else {
            // Draw gradient while loading
            const gradient = gs.ctx.createLinearGradient(0, 0, 0, gs.canvas.height);
            gradient.addColorStop(0, '#0a3d91');
            gradient.addColorStop(1, '#1e7bc0');
            gs.ctx.fillStyle = gradient;
            gs.ctx.fillRect(0, 0, gs.canvas.width, gs.canvas.height);
        }
    } else {
        // Draw water gradient
        const waterGradient = gs.ctx.createLinearGradient(0, 0, 0, gs.canvas.height);
        waterGradient.addColorStop(0, theme.top || '#0a3d91');
        waterGradient.addColorStop(1, theme.bottom || '#1e7bc0');
        gs.ctx.fillStyle = waterGradient;
        gs.ctx.fillRect(0, 0, gs.canvas.width, gs.canvas.height);
    }
    
    // Draw some animated bubbles over the background
    const bubbleColor = theme.bubble || 'rgba(255, 255, 255, 0.2)';
    const bubbleHighlight = theme.bubbleHighlight || 'rgba(255, 255, 255, 0.4)';
    
    gs.ctx.fillStyle = bubbleColor;
    for (let i = 0; i < 15; i++) {
        const x = (Math.sin(Date.now() / 1000 + i * 0.5) * 50 + i * 60) % gs.canvas.width;
        const y = (Date.now() / 10 + i * 40) % gs.canvas.height;
        const radius = 4 + Math.sin(Date.now() / 500 + i) * 3;
        
        gs.ctx.beginPath();
        gs.ctx.arc(x, y, radius, 0, Math.PI * 2);
        gs.ctx.fill();
        
        // Draw bubble highlight
        gs.ctx.fillStyle = bubbleHighlight;
        gs.ctx.beginPath();
        gs.ctx.arc(x - radius/3, y - radius/3, radius/3, 0, Math.PI * 2);
        gs.ctx.fill();
        gs.ctx.fillStyle = bubbleColor;
    }
}

// Main game loop
function gameLoop() {
    const gs = window.gameState;
    if (!gs.gameRunning || gs.gamePaused) return;
    
    // Clear canvas with water background
    drawWaterBackground();
    
    // Update and draw game elements
    updateFish();
    updateBalls();
    drawBalls();
    drawFish();
    
    // Update particles
    if (window.updateParticles) {
        window.updateParticles();
    }
    
    // Continue game loop
    gs.animationId = requestAnimationFrame(gameLoop);
}

// Initialize everything
function initGame() {
    // Initialize DOM references
    initDOMReferences();
    
    // Initialize speech synthesis
    if (window.initSpeechSynthesis) {
        window.initSpeechSynthesis();
    }
    
    // Initialize sounds
    if (window.createSounds) {
        window.createSounds();
    }
    
    // Update button texts initially
    if (window.updateButtonTexts) {
        window.updateButtonTexts();
    }
    
    // Initial draw
    const gs = window.gameState;
    if (gs.canvas) {
        drawWaterBackground();
        drawFish();
        drawBalls();
        
        // Show initial message
        if (window.systemMessages && window.showMessage) {
            window.showMessage(
                window.systemMessages.welcome[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
    }
    
    // Add canvas event listeners
    if (gs.canvas) {
        gs.canvas.addEventListener('mousemove', (e) => {
            const rect = gs.canvas.getBoundingClientRect();
            gs.mouseX = e.clientX - rect.left;
            gs.mouseY = e.clientY - rect.top;
        });
        
        gs.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = gs.canvas.getBoundingClientRect();
            gs.mouseX = e.touches[0].clientX - rect.left;
            gs.mouseY = e.touches[0].clientY - rect.top;
        }, { passive: false });
    }
    
    // Add button event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
    
    // Add sound control listeners
    document.getElementById('soundOnBtn').addEventListener('click', () => {
        window.gameState.soundEnabled = true;
        const gs = window.gameState;
        if (gs.canvas && window.systemMessages && window.showMessage) {
            window.showMessage(
                window.systemMessages.soundsOn[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        if (window.updateButtonTexts) window.updateButtonTexts();
    });
    
    document.getElementById('soundOffBtn').addEventListener('click', () => {
        window.gameState.soundEnabled = false;
        const gs = window.gameState;
        if (gs.canvas && window.systemMessages && window.showMessage) {
            window.showMessage(
                window.systemMessages.soundsOff[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        if (window.updateButtonTexts) window.updateButtonTexts();
    });
    
    // Add voice control listeners
    document.getElementById('voiceOnBtn').addEventListener('click', () => {
        const gs = window.gameState;
        gs.voiceEnabled = true;
        document.getElementById('voiceOnBtn').classList.add('active');
        document.getElementById('voiceOffBtn').classList.remove('active');
        
        if (gs.canvas && window.systemMessages && window.showMessage) {
            window.showMessage(
                window.systemMessages.voiceOn[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        
        // Test voice
        if (gs.speechSynthesisSupported && window.speakText) {
            const testMessage = gs.currentLanguage === 'sinhala' ? "හලෝ!" : "Hello!";
            window.speakText(testMessage);
        }
    });
    
    document.getElementById('voiceOffBtn').addEventListener('click', () => {
        const gs = window.gameState;
        gs.voiceEnabled = false;
        document.getElementById('voiceOffBtn').classList.add('active');
        document.getElementById('voiceOnBtn').classList.remove('active');
        
        if (gs.canvas && window.systemMessages && window.showMessage) {
            window.showMessage(
                window.systemMessages.voiceOff[gs.currentLanguage], 
                "bad", 
                gs.canvas.width/2, 
                gs.canvas.height/2
            );
        }
        
        // Cancel speech
        if (gs.speechSynthesisSupported) {
            speechSynthesis.cancel();
        }
    });
    
    // Add language toggle listeners
    document.getElementById('sinhalaBtn').addEventListener('click', () => {
        const gs = window.gameState;
        if (gs.currentLanguage !== 'sinhala') {
            gs.currentLanguage = 'sinhala';
            document.getElementById('sinhalaBtn').classList.add('active');
            document.getElementById('englishBtn').classList.remove('active');
            
            if (gs.canvas && window.showMessage) {
                window.showMessage("සිංහල භාෂාව", "bad", gs.canvas.width/2, gs.canvas.height/2);
            }
            
            if (window.updateButtonTexts) window.updateButtonTexts();
        }
    });
    
    document.getElementById('englishBtn').addEventListener('click', () => {
        const gs = window.gameState;
        if (gs.currentLanguage !== 'english') {
            gs.currentLanguage = 'english';
            document.getElementById('englishBtn').classList.add('active');
            document.getElementById('sinhalaBtn').classList.remove('active');
            
            if (gs.canvas && window.showMessage) {
                window.showMessage("English Language", "bad", gs.canvas.width/2, gs.canvas.height/2);
            }
            
            if (window.updateButtonTexts) window.updateButtonTexts();
        }
    });
}

// Initialize when page loads
window.addEventListener('load', initGame);