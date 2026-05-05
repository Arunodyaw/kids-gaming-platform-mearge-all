import React, { useEffect, useRef } from "react";
import { launchGame } from "../game/main"; // Import our game launcher

/**
 * This React component is the "bridge" that
 * holds and manages the Phaser game instance.
 */
export const PhaserGame = () => {
  // A ref to hold the Phaser game instance
  const gameInstance = useRef(null);

  // This useEffect hook runs once when the component mounts
  useEffect(() => {
    // Make sure we only create one game instance
    if (gameInstance.current) {
      return;
    }

    // Call our launcher function from main.js
    // It will attach the game to the div with id "phaser-game-container"
    gameInstance.current = launchGame("phaser-game-container");

    // This is a cleanup function.
    // It runs when the component is unmounted (e.g., user navigates away)
    return () => {
      gameInstance.current.destroy(true); // Destroy the game
      gameInstance.current = null;
    };
  }, []); // The empty array [] means this effect runs only once

  // This is what the component renders:
  // A simple div for Phaser to attach to.
  return <div id="phaser-game-container" />;
};
