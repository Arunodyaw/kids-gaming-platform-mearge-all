import Phaser from "phaser";

/**
 * This scene handles all the core game logic for the
 * "Blueprint Builder" game.
 */
export default class BlueprintScene extends Phaser.Scene {
  constructor() {
    super("BlueprintScene");

    this.isBuilding = true; // Game state: 'true' = building, 'false' = simulation
    this.partsBin = {}; // To store the UI elements
    this.builtParts = []; // A list of all parts the player has built
    this.activeDrag = null; // The part currently being dragged
    this.activeFan = null; // A reference to the fan, if built
    this.goButton = null;
  }

  create() {
    // --- Ground ---
    // Create a static ground body
    this.matter.add.rectangle(
      this.cameras.main.width / 2,
      650,
      this.cameras.main.width,
      50,
      {
        isStatic: true,
        label: "ground",
        render: { fillStyle: "#996633" },
      }
    );

    // --- 1. Draw the Blueprint ---
    this.createBlueprint();

    // --- 2. Create the Parts Bin ---
    this.createPartsBin();

    // --- 3. & 4. Implement Drag & Drop ---
    this.setupDragEvents();

    // --- "Go!" Button ---
    this.goButton = this.add
      .text(900, 720, "GO!", {
        fontSize: "48px",
        color: "#ffffff",
        backgroundColor: "#00cc00",
        padding: { x: 20, y: 10 },
      })
      .setInteractive()
      .on("pointerdown", () => this.startSimulation());

    // --- Goal Area ---
    this.matter.add.rectangle(950, 575, 50, 100, {
      isStatic: true,
      isSensor: true, // A sensor detects collision but doesn't cause one
      label: "goal",
    });
  }

  update(time, delta) {
    if (this.isBuilding) {
      // --- Handle Dragging ---
      if (this.activeDrag) {
        // Move the part with the mouse
        this.activeDrag.setPosition(
          this.input.activePointer.x,
          this.input.activePointer.y
        );
      }
    } else {
      // --- Simulation Phase ---
      // If we have an active fan, apply a force to it
      if (this.activeFan) {
        // Apply force relative to the fan's body
        this.activeFan.applyForce({ x: 0.01, y: 0 });
      }
    }
  }

  // --- Helper Functions ---

  /**
   * Shows a blueprint for 5 seconds, then hides it.
   */
  createBlueprint() {
    const blueprintContainer = this.add.container(
      this.cameras.main.centerX,
      250
    );

    // Use graphics to draw a "ghost" of the target vehicle
    const bpTitle = this.add
      .text(0, -100, "BLUEPRINT", { fontSize: "24px", color: "#000033" })
      .setOrigin(0.5);
    const bpBox = this.add
      .graphics()
      .lineStyle(4, 0x000033, 0.5)
      .strokeRect(-50, -50, 100, 100);
    const bpWheel = this.add
      .graphics()
      .lineStyle(4, 0x000033, 0.5)
      .strokeCircle(0, 75, 25);

    blueprintContainer.add([bpTitle, bpBox, bpWheel]);

    // Use a timer to destroy the blueprint
    this.time.delayedCall(5000, () => {
      // Add a "fade out" tween for a nice effect
      this.tweens.add({
        targets: blueprintContainer,
        alpha: 0,
        duration: 500,
        onComplete: () => blueprintContainer.destroy(),
      });
    });
  }

  /**
   * Creates the UI at the bottom with clickable parts.
   */
  createPartsBin() {
    // Bin background
    this.add.rectangle(
      this.cameras.main.width / 2,
      730,
      this.cameras.main.width,
      100,
      0x555555
    );

    // --- Box Part ---
    this.partsBin.box = this.add
      .rectangle(150, 730, 80, 80, 0xcccccc)
      .setInteractive();
    this.add.text(150, 730, "Box", { color: "#000" }).setOrigin(0.5);
    this.partsBin.box.on("pointerdown", () =>
      this.createDraggablePart(150, 730, "box")
    );

    // --- Wheel Part ---
    this.partsBin.wheel = this.add
      .circle(280, 730, 40, 0xcccccc)
      .setInteractive();
    this.add.text(280, 730, "Wheel", { color: "#000" }).setOrigin(0.5);
    this.partsBin.wheel.on("pointerdown", () =>
      this.createDraggablePart(280, 730, "wheel")
    );

    // --- Fan Part ---
    this.partsBin.fan = this.add
      .triangle(410, 730, 0, 80, 80, 80, 40, 0, 0xcccccc)
      .setInteractive();
    this.add.text(410, 730, "Fan", { color: "#000" }).setOrigin(0.5);
    this.partsBin.fan.on("pointerdown", () =>
      this.createDraggablePart(410, 730, "fan")
    );
  }

  /**
   * Creates a new physics-enabled part at the pointer's location.
   */
  createDraggablePart(x, y, type) {
    if (!this.isBuilding) return; // Don't allow new parts during simulation

    let part;
    if (type === "box") {
      part = this.matter.add.rectangle(x, y, 80, 80, { label: "box" });
    } else if (type === "wheel") {
      part = this.matter.add.circle(x, y, 40, {
        label: "wheel",
        friction: 0.9,
      });
    } else if (type === "fan") {
      // A trapezoid is a good shape for a fan/rocket
      part = this.matter.add.trapezoid(x, y, 80, 80, 0.5, { label: "fan" });
    }

    // Start the part as "static" so it doesn't fall while dragging
    part.setStatic(true);
    part.setData("partType", type);

    // Set this new part as the one we are actively dragging
    this.activeDrag = part;
  }

  /**
   * Sets up the global mouse events for dragging and dropping.
   */
  setupDragEvents() {
    // --- On Mouse Move ---
    this.input.on("pointermove", (pointer) => {
      if (this.activeDrag) {
        this.activeDrag.setPosition(pointer.x, pointer.y);
      }
    });

    // --- On Mouse Up (Drop) ---
    this.input.on("pointerup", (pointer) => {
      if (!this.activeDrag) return;

      const droppedPart = this.activeDrag;
      this.activeDrag = null;

      // Make the part "real" by un-static-ing it
      droppedPart.setStatic(false);

      // --- 5. "Snap" Parts Together ---
      // Find the closest *already built* part
      const closestPart = this.matter.closest(droppedPart, this.builtParts);

      if (closestPart) {
        const dist = Phaser.Math.Distance.Between(
          droppedPart.position.x,
          droppedPart.position.y,
          closestPart.position.x,
          closestPart.position.y
        );

        // Snap threshold (100 pixels)
        if (dist < 100) {
          // Weld the two parts together!
          this.matter.add.constraint(droppedPart, closestPart, dist, 0.9);
        }
      }

      // Add this part to our list of built parts
      this.builtParts.push(droppedPart);
    });
  }

  /**
   * Called when the "GO!" button is pressed.
   */
  startSimulation() {
    if (!this.isBuilding) return; // Simulation already running

    this.isBuilding = false;
    this.goButton.destroy(); // Remove the button

    // Disable the parts bin
    this.partsBin.box.disableInteractive();
    this.partsBin.wheel.disableInteractive();
    this.partsBin.fan.disableInteractive();

    // Find the fan (if one was built) to apply force in update()
    this.activeFan = this.builtParts.find(
      (p) => p.getData("partType") === "fan"
    );

    // --- Data Collection (Stub) ---
    // This is where you would log the player's creation
    const creationData = this.builtParts.map((p) => ({
      type: p.getData("partType"),
      x: p.position.x,
      y: p.position.y,
    }));
    console.log("--- PLAYER'S CREATION ---", creationData);
  }
}
