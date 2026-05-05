import Phaser from "phaser";

/**
 * Scene 2: The Control Room (See It)
 * This scene shows the player which alien to find.
 */
export class ControlRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: "ControlRoomScene" });
  }

  /**
   * Load assets
   */
  preload() {
    // --- !!! THIS IS THE CORRECTED PART !!! ---

    // We will create 3 simple 64x64 colored squares as placeholders.
    // This is much more reliable than the 'generate' method.

    // Create a 'pink' 64x64 texture
    const pink = this.textures.createCanvas("alien-pink", 64, 64);
    if (pink) {
      const ctx = pink.getContext();
      ctx.fillStyle = "#FF69B4"; // Pink
      ctx.fillRect(0, 0, 64, 64);
      pink.refresh();
    }

    // Create a 'green' 64x64 texture
    const green = this.textures.createCanvas("alien-green", 64, 64);
    if (green) {
      const ctx = green.getContext();
      ctx.fillStyle = "#32CD32"; // Green
      ctx.fillRect(0, 0, 64, 64);
      green.refresh();
    }

    // Create a 'blue' 64x64 texture
    const blue = this.textures.createCanvas("alien-blue", 64, 64);
    if (blue) {
      const ctx = blue.getContext();
      ctx.fillStyle = "#1E90FF"; // Blue
      ctx.fillRect(0, 0, 64, 64);
      blue.refresh();
    }

    // --- REAL ASSETS (for when you have them) ---
    // this.load.image('controlRoomBG', 'assets/images/control_room_bg.png');
    // this.load.image('alien-pink', 'assets/images/alien_pink.png');
    // this.load.image('alien-green', 'assets/images/alien_green.png');
    // this.load.image('alien-blue', 'assets/images/alien_blue.png');
  }

  /**
   * Create game objects
   */
  create() {
    // --- Background ---
    // (Uncomment when you have a real background)
    // this.add.image(400, 300, 'controlRoomBG');

    // --- Game Logic: Pick a Target ---
    const aliens = ["alien-pink", "alien-green", "alien-blue"];
    const targetAlienKey = Phaser.Math.RND.pick(aliens);

    // --- Crucial Step: Save to Registry ---
    this.game.registry.set("targetAlien", targetAlienKey);

    // --- Display ---
    this.add
      .text(400, 100, "EMERGENCY!", {
        fontSize: "42px",
        fill: "#FF0000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 150, "This little one is lost! Find it!", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // --- "Viewscreen" (A simple black box) ---
    this.add
      .rectangle(400, 300, 200, 200, 0x000000, 0.5)
      .setStrokeStyle(2, 0xffffff); // White border

    // --- Display the Target Alien ---
    // This will now correctly find 'alien-pink', 'alien-green', or 'alien-blue'
    const alienImage = this.add.image(400, 300, targetAlienKey);
    // We don't need to scale it since it's already 64x64

    // --- Animate It (to draw attention) ---
    this.tweens.add({
      targets: alienImage,
      scale: 1.2, // "Pulse" bigger
      duration: 700,
      yoyo: true, // Go back and forth
      repeat: -1, // Repeat forever
      ease: "Sine.easeInOut",
    });

    // --- "Go!" Button ---
    const goButton = this.add
      .text(400, 480, "I'll find them!", {
        fontSize: "28px",
        fill: "#000000",
        backgroundColor: "#FFC107",
        fontStyle: "bold",
        fontFamily: "Arial",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    goButton.setInteractive({ useHandCursor: true });

    // --- (!!! THIS IS THE UPDATE !!!) ---
    goButton.on("pointerdown", () => {
      // Remove the old "Loading..." text

      // Start the PuzzleScene!
      this.scene.start("PuzzleScene");
    });
  }
}
