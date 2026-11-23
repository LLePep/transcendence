import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { TICK_RATE, ARENA_WIDTH, ARENA_HEIGHT } from "./shared/constants.js";
import { stepEntity, type EntityState, type MoveInputLike } from "./shared/movement.js";

const PORT = Number(process.env.PORT) || 3000;

// --- Express : les routes HTTP classiques (/api/...) ---
const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Express et Socket.io partagent le même serveur HTTP (donc le même port)
const httpServer = createServer(app);
const io = new Server(httpServer);

// --- État du jeu : uniquement sur le serveur (serveur autoritaire) ---
interface Player extends EntityState {
  input: MoveInputLike; // dernier input reçu, appliqué à chaque tick
}
const playersById = new Map<string, Player>();
let joinCount = 0;

io.on("connection", (socket) => {
  // Position de départ en spirale, pour que deux joueurs ne se superposent pas
  const angle = joinCount++ * 2.399963;
  playersById.set(socket.id, {
    x: ARENA_WIDTH / 2 + Math.cos(angle) * 80,
    y: ARENA_HEIGHT / 2 + Math.sin(angle) * 80,
    vx: 0,
    vy: 0,
    input: { moveX: 0, moveY: 0 },
  });
  console.log(`${socket.id} connecté (${playersById.size} joueur(s))`);

  socket.on("input", (data: unknown) => {
    const player = playersById.get(socket.id);
    if (player) player.input = sanitizeInput(data);
  });

  socket.on("disconnect", (reason) => {
    playersById.delete(socket.id);
    console.log(`${socket.id} déconnecté (${reason})`);
  });
});

/** Ne jamais faire confiance au client : tout ce qui n'est pas -1/0/1 devient 0. */
function sanitizeInput(data: unknown): MoveInputLike {
  const d = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  return { moveX: toAxis(d.moveX), moveY: toAxis(d.moveY) };
}
function toAxis(value: unknown): -1 | 0 | 1 {
  return value === -1 || value === 1 ? value : 0;
}

// --- Boucle de jeu : TICK_RATE fois par seconde ---
const dt = 1 / TICK_RATE;
setInterval(() => {
  const state: Record<string, { x: number; y: number }> = {};
  for (const [id, player] of playersById) {
    stepEntity(player, player.input, dt);
    state[id] = { x: player.x, y: player.y };
  }
  io.emit("state", state); // envoie le state à tous les clients connectés
}, 1000 / TICK_RATE);

httpServer.listen(PORT, () => {
  console.log(`Serveur prêt sur le port ${PORT}`);
});

// Arrêt propre : "docker stop" envoie SIGTERM, Ctrl+C envoie SIGINT
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`${signal} reçu, arrêt du serveur`);
    io.close(() => process.exit(0));
  });
}
