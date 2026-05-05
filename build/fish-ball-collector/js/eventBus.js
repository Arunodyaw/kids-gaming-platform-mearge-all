// Example usage from your Phaser code
import { eventBus } from "../tracking/eventBus";

// score update
eventBus.emit("GAME_EVENT", { type: "SCORE_CHANGED", score: this.score, ts: Date.now() });

// red ball eaten
eventBus.emit("GAME_EVENT", { type: "RED_HIT", redCount: this.redCount, ts: Date.now() });

// reaction time
eventBus.emit("GAME_EVENT", { type: "REACTION", reactionMs: rt, ts: Date.now() });

// game over (3 red balls)
eventBus.emit("GAME_EVENT", {
  type: "GAME_OVER",
  finalScore: this.score,
  durationMs: Date.now() - this.startTs,
  ts: Date.now()
});
