import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
// Going back to the standard relative path.
// This path assumes your file is in 'src/components/'
// and the config is in 'src/phaser-blueprint/'
import gameConfig from "../phaser-blueprint/config.js";

/**
 * This is the React component that hosts our new
 * "Blueprint Builder" physics game.
 */
export default function BlueprintGame() {
  // A ref to hold the <div> that Phaser will attach its canvas to
  const gameContainerRef = useRef(null);

  // A ref to hold the Phaser.Game instance
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // This effect runs once when the component mounts

    // Do nothing if the game instance is already created
    if (gameInstanceRef.current) {
      return;
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
    // This runs when the component unmounts (e.g., user navigates away)
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true); // Destroy the game
        gameInstanceRef.current = null; // Clear the ref
      }
    };
  }, []); // The empty array [] means this effect runs only once

  // This div is what Phaser will use as its parent
  return <div id="blueprint-game-container" ref={gameContainerRef} />;
}
