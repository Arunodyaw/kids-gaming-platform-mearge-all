import Phaser from "phaser";

/**
 * This is the Phaser Main Menu Scene.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    // The 'key' is how Phaser identifies this scene
    super({ key: "MainMenuScene" });
  }

  /**
   * Load assets (images, audio)
   */
  preload() {
    // --- PLACEHOLDER ASSETS ---
    // We'll generate a texture for our button
    this.textures.generate("playButtonPlaceholder", {
      data: [
        "....................",
        ".cccccccccccccccccc.",
        ".cFFFFFFFFFFFFFFFFc.",
        ".cFFFFFFFFFFFFFFFFc.",
        ".cFFFFFFFFFFFFFFFFc.",
        ".cccccccccccccccccc.",
        "....................",
      ],
      palette: {
        ".": "rgba(0,0,0,0)", // Transparent
        c: "#008800", // Dark green border
        F: "#4CAF50", // Bright green fill
      },
      pixelWidth: 8,
    });
  }

  /**
   * Create game objects (sprites, text)
   */
  create() {
    // --- TITLE TEXT ---
    this.add
      .text(400, 250, "Alien Zookeeper", {
        fontSize: "52px",
        fill: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5); // Center the text

    // --- PLAY BUTTON ---
    const playButton = this.add
      .image(400, 350, "playButtonPlaceholder")
      .setScale(1.5)
      .setOrigin(0.5);

    // --- BUTTON INTERACTIVITY ---
    playButton.setInteractive({ useHandCursor: true });

    // On hover: Make the button slightly transparent
    playButton.on("pointerover", () => {
      playButton.setAlpha(0.8);
    });

    // On hover out: Return to full opacity
    playButton.on("pointerout", () => {
      playButton.setAlpha(1);
    });

    // On click: Go to the next scene
    playButton.on("pointerdown", () => {
      // 1. Remove the old "Loading..." text

      // 2. Start the ControlRoomScene
      this.scene.start("ControlRoomScene");
    });
  }
}
