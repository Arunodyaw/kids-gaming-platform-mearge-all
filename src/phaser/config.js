// src/phaser/config.js
import Phaser from "phaser";
import GameScene from "./GameScene"; // We will build this next

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  // parent: ... (remove this as we did before)
  backgroundColor: "#f0f0f0",

  // --- THIS IS THE KEY ---
  // Add the physics configuration
  physics: {
    default: "matter", // Use the Matter.js engine
    matter: {
      gravity: { y: 1 }, // Standard gravity
      debug: true, // VERY helpful - shows the physics outlines
    },
  },
  // --- END KEY ---

  scene: [GameScene], // We will start with one scene
};

export default config;
