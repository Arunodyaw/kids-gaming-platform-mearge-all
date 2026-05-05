import Phaser from "phaser";

/**
 * Scene 4: The Engine Room (Find It)
 * The player must find the alien they saw in the Control Room.
 */
export class EngineRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: "EngineRoomScene" });
  }

  preload() {
    // --- Re-create the placeholder textures ---
    // We do this again to ensure this scene can run independently
    // and has access to the textures.

    // Pink
    const pink = this.textures.createCanvas("alien-pink", 64, 64);
    if (pink) {
      const ctx = pink.getContext();
      ctx.fillStyle = "#FF69B4";
      ctx.fillRect(0, 0, 64, 64);
      pink.refresh();
    }

    // Green
    const green = this.textures.createCanvas("alien-green", 64, 64);
    if (green) {
      const ctx = green.getContext();
      ctx.fillStyle = "#32CD32";
      ctx.fillRect(0, 0, 64, 64);
      green.refresh();
    }

    // Blue
    const blue = this.textures.createCanvas("alien-blue", 64, 64);
    if (blue) {
      const ctx = blue.getContext();
      ctx.fillStyle = "#1E90FF";
      ctx.fillRect(0, 0, 64, 64);
      blue.refresh();
    }

    // --- REAL ASSETS (for when you have them) ---
    // this.load.image('engineRoomBG', 'assets/images/engine_room_bg.png');
    // this.load.image('alien-pink', 'assets/images/alien_pink.png');
    // this.load.image('alien-green', 'assets/images/alien_green.png');
    // this.load.image('alien-blue', 'assets/images/alien_blue.png');
    // this.load.audio('correct-sound', 'assets/audio/correct.mp3');
    // this.load.audio('wrong-sound', 'assets/audio/wrong.mp3');
  }

  create() {
    // --- Background ---
    // (Uncomment when you have a real background)
    // this.add.image(400, 300, 'engineRoomBG');

    // --- Display ---
    this.add
      .text(400, 100, "Which one was it?", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(400, 150, "Click the alien you saw!", {
        fontSize: "24px",
        fill: "#FFFF00",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // --- Get the Target Alien ---
    // We retrieve the key we saved in the ControlRoomScene.
    const targetAlienKey = this.game.registry.get("targetAlien");

    // --- Display All 3 Aliens ---
    const aliens = [
      { key: "alien-pink", x: 250 },
      { key: "alien-green", x: 400 },
      { key: "alien-blue", x: 550 },
    ];

    for (const alien of aliens) {
      const alienImage = this.add
        .image(alien.x, 300, alien.key)
        .setScale(1.5)
        .setInteractive({ useHandCursor: true });

      // Add click event
      alienImage.on("pointerdown", () => {
        this.checkAnswer(alien.key, targetAlienKey, alienImage);
      });
    }
  }

  /**
   * Checks if the clicked alien is the correct one.
   */
  checkAnswer(clickedKey, targetKey, clickedImage) {
    if (clickedKey === targetKey) {
      // --- CORRECT ANSWER ---
      // (Uncomment when you have sounds)
      // this.sound.play('correct-sound');

      this.statusText.setText("You found it!").setFill("#00FF00");

      // Go to the WinScene after a short delay
      this.time.delayedCall(1000, () => {
        this.scene.start("WinScene");
      });
    } else {
      // --- WRONG ANSWER ---
      // (Uncomment when you have sounds)
      // this.sound.play('wrong-sound');

      this.statusText
        .setText("Oops! That's not the one. Try again!")
        .setFill("#FF0000");

      // Make the "wrong" text fade out
      this.tweens.add({
        targets: this.statusText,
        alpha: 0,
        duration: 1000,
        ease: "Power1",
        onComplete: () => {
          // Reset text
          this.statusText
            .setText("Click the alien you saw!")
            .setFill("#FFFF00")
            .setAlpha(1);
        },
      });

      // Make the clicked (wrong) alien shake
      this.tweens.add({
        targets: clickedImage,
        x: clickedImage.x + 10, // Shake right
        duration: 50,
        yoyo: true,
        repeat: 3, // Shake a few times
        ease: "Quad.easeInOut",
      });
    }
  }
}
