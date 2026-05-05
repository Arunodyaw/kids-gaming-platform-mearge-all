import Phaser from "phaser";
import BlueprintScene from "./BlueprintScene.js"; // Added .js here too for consistency

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: "#F0F7FF", // A light, "drafting paper" blue

  // --- Enable Matter.js Physics ---
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 },
      // Debug shows the outlines of all physics bodies.
      // VERY useful for building and debugging.
      debug: true,
    },
  },
  // --- End Physics ---

  scene: [BlueprintScene],
};

export default config;
