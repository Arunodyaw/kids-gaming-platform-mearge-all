import Phaser from "phaser";

/**
 * Scene 3: The Puzzle (Do It)
 * A "Simon Says" distractor task.
 */
export class PuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: "PuzzleScene" });
  }

  preload() {
    // Red Button
    const red = this.textures.createCanvas("btn-red", 100, 100);
    if (red) {
      const ctx = red.getContext();
      ctx.fillStyle = "#FF0000"; // Red
      ctx.fillRect(0, 0, 100, 100);
      red.refresh();
    }

    // Yellow Button
    const yellow = this.textures.createCanvas("btn-yellow", 100, 100);
    if (yellow) {
      const ctx = yellow.getContext();
      ctx.fillStyle = "#FFFF00"; // Yellow
      ctx.fillRect(0, 0, 100, 100);
      yellow.refresh();
    }

    // Blue Button
    const blue = this.textures.createCanvas("btn-blue", 100, 100);
    if (blue) {
      const ctx = blue.getContext();
      ctx.fillStyle = "#0000FF"; // Blue
      ctx.fillRect(0, 0, 100, 100);
      blue.refresh();
    }
  }

  create() {
    // --- Game Logic Variables ---
    this.sequence = ["red", "blue", "yellow"];
    this.playerInput = [];
    this.isPlayerTurn = false;

    // --- Display ---
    this.add
      .text(400, 100, "Power Up the Circuits!", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(400, 150, "Watch the sequence...", {
        fontSize: "24px",
        fill: "#FFFF00",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // --- Create Buttons ---
    this.buttons = {
      red: this.add.image(250, 300, "btn-red"),
      yellow: this.add.image(400, 300, "btn-yellow"),
      blue: this.add.image(550, 300, "btn-blue"),
    };

    // --- Make Buttons Interactive ---
    for (const key in this.buttons) {
      const button = this.buttons[key];
      button.setInteractive({ useHandCursor: true });

      button.on("pointerdown", () => {
        this.handlePlayerInput(key);
      });
    }

    // --- Start the game after a short delay ---
    this.time.delayedCall(1000, () => {
      this.showSequence();
    });
  }

  /**
   * Resets and starts showing the sequence to the player.
   */
  showSequence() {
    this.isPlayerTurn = false;
    this.playerInput = [];
    this.statusText.setText("Watch the sequence...");

    // Start showing the sequence from the first item (index 0)
    this.showNextInSequence(0);
  }

  /**
   * Shows a single step in the sequence and schedules the next step.
   * This is a "recursive" style function.
   */
  showNextInSequence(index) {
    // Check if we are at the end of the sequence
    if (index >= this.sequence.length) {
      // Sequence is over, it's the player's turn
      this.isPlayerTurn = true;
      this.statusText.setText("Your Turn! Repeat the sequence.");
      return;
    }

    // Get the key (e.g., 'red') for the current index
    const key = this.sequence[index];

    // Flash the button
    this.flashButton(key);

    // Schedule the *next* step (index + 1) after a delay
    this.time.delayedCall(800, () => {
      // 0.8 second pause between flashes
      this.showNextInSequence(index + 1);
    });
  }

  /**
   * Makes a button "flash" to show it in the sequence.
   */
  flashButton(key) {
    const button = this.buttons[key];

    // (Uncomment when you have sounds)
    // this.sound.play(`tone-${key}`);

    this.tweens.add({
      targets: button,
      scale: 1.2,
      duration: 300, // Flash for 0.3s
      yoyo: true,
      ease: "Quad.easeInOut",
    });
  }

  /**
   * Handles the player clicking a button.
   */
  handlePlayerInput(key) {
    if (!this.isPlayerTurn) return;

    // Flash the button the player clicked (a smaller flash)
    this.tweens.add({
      targets: this.buttons[key],
      scale: 1.1,
      duration: 150,
      yoyo: true,
      ease: "Quad.easeInOut",
    });

    this.playerInput.push(key);

    const inputIndex = this.playerInput.length - 1;

    // Check if this click was wrong
    if (this.playerInput[inputIndex] !== this.sequence[inputIndex]) {
      // --- WRONG ANSWER ---
      this.isPlayerTurn = false;
      // (Uncomment when you have sounds)
      // this.sound.play('wrong-sound');
      this.statusText.setText("Oops! Try again. Watch closely...");

      this.time.delayedCall(1500, () => {
        this.showSequence(); // Restart the sequence
      });
      return;
    }

    // --- CORRECT (so far) ---
    // Check if the player has finished the whole sequence
    if (this.playerInput.length === this.sequence.length) {
      // --- CORRECT & FINISHED ---
      this.isPlayerTurn = false;
      // (Uncomment when you have sounds)
      // this.sound.play('correct-sound');
      this.statusText.setText("Great Job! Circuits Powered!");

      // --- (!!! THIS IS THE UPDATE !!!) ---
      this.time.delayedCall(1500, () => {
        // Start the EngineRoomScene!
        this.scene.start("EngineRoomScene");
      });
    }
    // If they are correct but not finished, we just wait for the next click.
  }
}
