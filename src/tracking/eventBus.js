class EventBus {
    constructor() {
        this.handlers = {};
    }

    on(event, handler) {
        this.handlers[event] = this.handlers[event] || [];
        this.handlers[event].push(handler);
        return () => {
            this.handlers[event] = (this.handlers[event] || []).filter(h => h !== handler);
        };
    }

    emit(event, payload) {
        (this.handlers[event] || []).forEach(h => h(payload));
    }
}

export const eventBus = new EventBus();

// Event types (documented for reference)
/*
  GAME_START: { type: "GAME_START", ts: number, sessionId: string }
  SCORE_CHANGED: { type: "SCORE_CHANGED", score: number, points: number, ballColor: string, ts: number, sessionId: string }
  BALL_COLLECTED: { type: "BALL_COLLECTED", ballColor: string, ballIndex: number, position: any, reactionTime: number | null, ts: number, sessionId: string }
  REACTION: { type: "REACTION", reactionMs: number, ts: number, sessionId: string }
  RED_HIT: { type: "RED_HIT", redCount: number, position: any, ts: number, sessionId: string }
  GAME_OVER: { type: "GAME_OVER", finalScore: number, redBallsTouched: number, ballsCollected: number, durationMs: number, averageReactionTime: number | null, ts: number, sessionId: string }
  BALL_SPAWN: { type: "BALL_SPAWN", ballColor: string, position: any, ts: number, sessionId: string }
  GAME_PAUSED: { type: "GAME_PAUSED", ts: number, sessionId: string }
  GAME_RESUMED: { type: "GAME_RESUMED", ts: number, sessionId: string }
*/
