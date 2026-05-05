import Phaser from "phaser";
import { MainMenuScene } from "./scenes/MainMenuScene";
// We will import other scenes here later
// import { ControlRoomScene } from './scenes/ControlRoomScene';
import { ControlRoomScene } from "./scenes/ControlRoomScene";
import { PuzzleScene } from "./scenes/PuzzleScene";
import { EngineRoomScene } from "./scenes/EngineRoomScene";
import { WinScene } from "./scenes/WinScene";

/**
 * This function launches the Phaser game.
 * It's exported so our React component can call it.
 * @param {string} containerId The id of the div to attach the game to.
 */
export const launchGame = (containerId) => {
  // The main Phaser game configuration
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId, // The ID of the div React will create
    backgroundColor: "#1d212d", // A dark sci-fi color

    // A list of all scenes in the game
    scene: [
      MainMenuScene,
      ControlRoomScene,
      PuzzleScene,
      EngineRoomScene,
      WinScene,
      // ControlRoomScene,
      // ... other scenes
    ],
  };

  // Create and return the new game instance
  return new Phaser.Game(config);
};
