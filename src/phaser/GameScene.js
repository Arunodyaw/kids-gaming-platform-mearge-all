// src/phaser/GameScene.js
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    // Game state variables
    this.firstCard = null;
    this.secondCard = null;
    this.canClick = true;

    // Data collection variables
    this.errorCount = 0;
    this.matchesFound = 0;
    this.startTime = 0;
  }

  // preload() {
  //   // TODO: Load your real assets here
  //   // this.load.image('card-back', 'assets/chest-closed.png');
  //   // this.load.image('gem-1', 'assets/gem-red.png');
  //   // this.load.image('gem-2', 'assets/gem-blue.png');
  // }

  create() {
    // --- Grid & Card Setup ---
    const GRID_COLS = 4;
    const GRID_ROWS = 3;
    const TOTAL_PAIRS = (GRID_COLS * GRID_ROWS) / 2;
    const CARD_WIDTH = 150;
    const CARD_HEIGHT = 200;
    const START_X = 125;
    const START_Y = 100;
    const GAP = 20;

    // Define the gem "types". We'll use colors for now.
    // 6 pairs for a 4x3 grid
    const gemTypes = [
      0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
    ];
    let cards = [];

    // Create pairs for each gem type
    for (const type of gemTypes) {
      cards.push(type);
      cards.push(type);
    }

    // Shuffle the cards
    Phaser.Utils.Array.Shuffle(cards);

    // --- Start Data Collection ---
    this.errorCount = 0;
    this.matchesFound = 0;
    this.startTime = new Date().getTime();

    // Create the "You Win!" text but hide it
    this.winText = this.add
      .text(400, 300, "All Pairs Found!", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Create the card grid
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const x = START_X + c * (CARD_WIDTH + GAP);
        const y = START_Y + r * (CARD_HEIGHT + GAP);
        const gemType = cards.pop();

        // Create the card (as a container)
        const card = this.add.container(x, y);
        card.setSize(CARD_WIDTH, CARD_HEIGHT);

        // --- Card Graphics (Simulated Assets) ---
        // 1. The "Back" (the closed chest)
        const cardBack = this.add
          .graphics()
          .fillStyle(0x808080) // Gray
          .fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        // 2. The "Front" (the gem)
        const cardFront = this.add
          .graphics()
          .fillStyle(gemType) // The gem's color
          .fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        // Add graphics to the container
        card.add(cardBack);
        card.add(cardFront);

        // Start with the front hidden
        cardFront.setVisible(false);

        // --- Card Data & Interaction ---
        card.setData("gemType", gemType);
        card.setData("isOpen", false);
        card.setInteractive();

        card.on("pointerdown", () => {
          this.handleCardClick(card, cardFront, cardBack);
        });
      }
    }
  }

  handleCardClick(card, cardFront, cardBack) {
    // Ignore click if we can't click, or card is already open
    if (!this.canClick || card.getData("isOpen")) {
      return;
    }

    // --- Reveal Card (Animation Stub) ---
    // TODO: Add a real flip animation here
    cardFront.setVisible(true);
    cardBack.setVisible(false);
    card.setData("isOpen", true);

    // --- Check for Match ---
    if (!this.firstCard) {
      // This is the first card clicked
      this.firstCard = card;
    } else {
      // This is the second card clicked
      this.secondCard = card;
      this.canClick = false; // Stop further clicks

      if (
        this.firstCard.getData("gemType") === this.secondCard.getData("gemType")
      ) {
        // MATCH
        this.matchesFound++;
        this.time.delayedCall(500, () => this.handleMatch());
      } else {
        // NO MATCH
        this.errorCount++;
        this.time.delayedCall(1000, () => this.handleNoMatch());
      }
    }
  }

  handleMatch() {
    // TODO: Play a "sparkle" or "correct" animation
    this.firstCard.disableInteractive();
    this.secondCard.disableInteractive();

    // Check for game win
    if (this.matchesFound === 6) {
      // 6 pairs
      this.handleGameWin();
    } else {
      this.resetTurn();
    }
  }

  handleNoMatch() {
    // --- Flip Cards Back Over (Animation Stub) ---
    // TODO: Animate this flip
    const cardsToFlip = [this.firstCard, this.secondCard];
    for (const card of cardsToFlip) {
      const cardFront = card.list[1];
      const cardBack = card.list[0];
      cardFront.setVisible(false);
      cardBack.setVisible(true);
      card.setData("isOpen", false);
    }

    this.resetTurn();
  }

  resetTurn() {
    this.firstCard = null;
    this.secondCard = null;
    this.canClick = true;
  }

  handleGameWin() {
    this.canClick = false;
    this.winText.setVisible(true);

    const timeToComplete = (new Date().getTime() - this.startTime) / 1000;

    // --- FINAL DATA ---
    // This is where you would emit the data back to React
    // For now, we just log it.
    console.log("--- GAME COMPLETE ---");
    console.log(`Time to complete: ${timeToComplete.toFixed(2)} seconds`);
    console.log(`Error count: ${this.errorCount}`);
  }
}
