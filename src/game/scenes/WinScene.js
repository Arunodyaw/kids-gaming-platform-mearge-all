import Phaser from "phaser";

/**
 * Scene 5: The Win Scene
 * This scene shows a "You Win" message and a "Play Again" button.
 */
export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinScene" });
  }

  preload() {
    // --- Create a placeholder button ---
    const button = this.textures.createCanvas("playAgainButton", 200, 60);
    if (button) {
      const ctx = button.getContext();
      ctx.fillStyle = "#4CAF50"; // Green
      ctx.fillRect(0, 0, 200, 60);
      button.refresh();
    }
  }

  create() {
    // --- Display ---
    this.add
      .text(400, 150, "You Found It!", {
        fontSize: "48px",
        fill: "#00FF00",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // --- Get the Target Alien ---
    // Get the key from the registry to show the alien they saved.
    const targetAlienKey = this.game.registry.get("targetAlien");

    if (targetAlienKey) {
      // Show the alien they found, nice and big!
      this.add.image(400, 300, targetAlienKey).setScale(3);
    }

    // --- Play Again Button ---
    const playAgainButton = this.add
      .image(400, 450, "playAgainButton")
      .setInteractive({ useHandCursor: true });

    // Add text on top of the button
    this.add
      .text(400, 450, "Play Again", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // --- Button Interactivity ---
    playAgainButton.on("pointerover", () => {
      playAgainButton.setAlpha(0.8);
    });

    playAgainButton.on("pointerout", () => {
      playAgainButton.setAlpha(1);
    });

    playAgainButton.on("pointerdown", () => {
      // (Uncomment when you have a click sound)
      // this.sound.play('clickSound');

      // Restart the entire game by going back to the Main Menu
      this.scene.start("MainMenuScene");
    });
  }
}
