// src/components/GemMatchGame.jsx

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import gameConfig from "../phaser/config"; // Make sure this path is correct

export default function GemMatchGame() {
  // We use a ref to hold a reference to the <div>
  const gameContainerRef = useRef(null);

  // We use a ref to hold the game instance itself.
  // This is important to prevent re-creating the game on every render.
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // This effect runs once when the component mounts

    // Check if we've already created a game instance
    if (gameInstanceRef.current) {
      return; // Game is already running
    }

    // --- Create the Phaser Game ---
    // We update the config to target the <div> from our ref
    const config = {
      ...gameConfig,
      parent: gameContainerRef.current, // Target our specific div
    };

    // Create the game instance and store it in the ref
    gameInstanceRef.current = new Phaser.Game(config);

    // --- Cleanup Function ---
    // This function runs when the component unmounts (e.g., user navigates away)
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true); // Destroy the game
        gameInstanceRef.current = null; // Clear the ref
      }
    };
  }, []); // The empty array [] means this effect runs only once

  // This div is what Phaser will attach its <canvas> to
  // We use the 'ref' prop to connect it to our gameContainerRef
  return <div id="phaser-game-container" ref={gameContainerRef} />;
}
