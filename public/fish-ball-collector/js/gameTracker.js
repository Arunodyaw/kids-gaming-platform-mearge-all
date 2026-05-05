// Game Tracker - Integrates Phaser game with event tracking
// This file bridges the vanilla JS game with the React tracking system

(function() {
    'use strict';
    
    // Global event emitter for game events
    window.gameTracker = {
        eventBus: null, // Will be set by React component
        sessionId: null,
        gameStartTime: null,
        lastBallSpawnTime: null,
        reactionTimes: [],
        
        // Initialize tracker
        init: function(eventBusInstance, sessionId) {
            this.eventBus = eventBusInstance;
            this.sessionId = sessionId;
        },
        
        // Track game start
        onGameStart: function() {
            this.gameStartTime = Date.now();
            this.lastBallSpawnTime = Date.now();
            this.reactionTimes = [];
            
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'GAME_START',
                    ts: this.gameStartTime,
                    sessionId: this.sessionId
                });
            }
        },
        
        // Track score changes
        onScoreChange: function(newScore, points, ballColor) {
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'SCORE_CHANGED',
                    score: newScore,
                    points: points,
                    ballColor: ballColor,
                    ts: Date.now(),
                    sessionId: this.sessionId
                });
            }
        },
        
        // Track ball collection
        onBallCollected: function(ballColor, ballIndex, position) {
            const now = Date.now();
            let reactionTime = null;
            
            // Calculate reaction time if ball was recently spawned
            if (this.lastBallSpawnTime && (now - this.lastBallSpawnTime) < 10000) {
                reactionTime = now - this.lastBallSpawnTime;
                this.reactionTimes.push(reactionTime);
            }
            
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'BALL_COLLECTED',
                    ballColor: ballColor,
                    ballIndex: ballIndex,
                    position: position,
                    reactionTime: reactionTime,
                    ts: now,
                    sessionId: this.sessionId
                });
                
                if (reactionTime !== null) {
                    this.eventBus.emit('GAME_EVENT', {
                        type: 'REACTION',
                        reactionMs: reactionTime,
                        ts: now,
                        sessionId: this.sessionId
                    });
                }
            }
            
            this.lastBallSpawnTime = now;
        },
        
        // Track red ball hit
        onRedBallHit: function(redCount, position) {
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'RED_HIT',
                    redCount: redCount,
                    position: position,
                    ts: Date.now(),
                    sessionId: this.sessionId
                });
            }
        },
        
        // Track game over
        onGameOver: function(finalScore, redBallsTouched, ballsCollected, duration) {
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'GAME_OVER',
                    finalScore: finalScore,
                    redBallsTouched: redBallsTouched,
                    ballsCollected: ballsCollected,
                    durationMs: duration,
                    averageReactionTime: this.reactionTimes.length > 0 
                        ? this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length 
                        : null,
                    ts: Date.now(),
                    sessionId: this.sessionId
                });
            }
        },
        
        // Track ball spawn
        onBallSpawn: function(ballColor, position) {
            this.lastBallSpawnTime = Date.now();
            
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'BALL_SPAWN',
                    ballColor: ballColor,
                    position: position,
                    ts: this.lastBallSpawnTime,
                    sessionId: this.sessionId
                });
            }
        },
        
        // Track pause/resume
        onPause: function() {
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'GAME_PAUSED',
                    ts: Date.now(),
                    sessionId: this.sessionId
                });
            }
        },
        
        onResume: function() {
            if (this.eventBus) {
                this.eventBus.emit('GAME_EVENT', {
                    type: 'GAME_RESUMED',
                    ts: Date.now(),
                    sessionId: this.sessionId
                });
            }
        }
    };
})();

