// Event Bus Bridge - Connects vanilla JS game with React eventBus
// This allows the Phaser game to emit events that React can capture

(function() {
    'use strict';
    
    // Create a simple event bus for vanilla JS
    window.vanillaEventBus = {
        handlers: {},
        
        on: function(event, handler) {
            if (!this.handlers[event]) {
                this.handlers[event] = [];
            }
            this.handlers[event].push(handler);
        },
        
        emit: function(event, payload) {
            if (this.handlers[event]) {
                this.handlers[event].forEach(handler => {
                    try {
                        handler(payload);
                    } catch (e) {
                        console.error('Event handler error:', e);
                    }
                });
            }
            
            // Also try to emit to React eventBus if available
            if (window.reactEventBus) {
                try {
                    window.reactEventBus.emit(event, payload);
                } catch (e) {
                    console.error('React eventBus error:', e);
                }
            }
        }
    };
    
    // Make gameTracker use vanillaEventBus by default
    if (window.gameTracker) {
        // gameTracker will be initialized with the React eventBus later
        // but can fall back to vanillaEventBus
    }
})();

