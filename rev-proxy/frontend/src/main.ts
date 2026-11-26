import * as Phaser from "phaser";
import { socket } from "./network";

// Doivent correspondre à backend/src/shared/constants.ts
const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 600;
const PLAYER_SIZE = 24;

/** Format de l'event "state" envoyé par le serveur. */
type State = Record<string, { x: number; y: number }>;

class GameScene extends Phaser.Scene {
  private playerRects = new Map<string, Phaser.GameObjects.Rectangle>();
  private status!: Phaser.GameObjects.Text;
  private keys!: Record<"up" | "down" | "left" | "right", Phaser.Input.Keyboard.Key>;
  private lastInput = { moveX: 0, moveY: 0 };

  constructor() {
    super("game");
  }

  create() {
    this.status = this.add.text(10, 10, "Connexion...", { color: "#ffffff" });
    this.keys = this.input.keyboard!.addKeys({
      up: "W", down: "S", left: "A", right: "D",
    }) as typeof this.keys;

    socket.on("connect", () => {
      this.status.setText(`Connecté : ${socket.id}`);
      socket.emit("input", this.lastInput); // si une touche était déjà enfoncée
    });
    socket.on("disconnect", () => this.status.setText("Déconnecté, reconnexion..."));
    socket.on("connect_error", () => this.status.setText("Impossible de joindre le serveur"));
    socket.on("state", (state: State) => this.applyState(state));

    socket.connect();
  }

  /** Met les carrés à jour à partir du state reçu du serveur. */
  private applyState(state: State) {
    // Joueurs partis : on retire leur carré
    for (const [id, rect] of this.playerRects) {
      if (!(id in state)) {
        rect.destroy();
        this.playerRects.delete(id);
      }
    }
    // Joueurs présents : on crée le carré si besoin, puis on le place
    for (const [id, { x, y }] of Object.entries(state)) {
      let rect = this.playerRects.get(id);
      if (!rect) {
        const color = id === socket.id ? 0x4ade80 : 0xf87171;
        rect = this.add.rectangle(x, y, PLAYER_SIZE, PLAYER_SIZE, color);
        this.playerRects.set(id, rect);
      }
      rect.setPosition(x, y);
    }
  }

  update() {
    const input = {
      moveX: axis(this.keys.left.isDown, this.keys.right.isDown),
      moveY: axis(this.keys.up.isDown, this.keys.down.isDown),
    };
    // On n'envoie que quand ça change : le serveur garde le dernier input reçu
    if (input.moveX !== this.lastInput.moveX || input.moveY !== this.lastInput.moveY) {
      this.lastInput = input;
      socket.emit("input", input);
    }
  }
}

/** -1, 0 ou 1 selon les touches enfoncées (les deux en même temps = 0). */
function axis(negative: boolean, positive: boolean): number {
  return negative === positive ? 0 : negative ? -1 : 1;
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: ARENA_WIDTH,
  height: ARENA_HEIGHT,
  backgroundColor: "#1e1e2e",
  scene: [GameScene],
});
