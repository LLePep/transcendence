import { createServer } from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { prisma } from './db.js';
import { TICK_RATE, ARENA_WIDTH, ARENA_HEIGHT } from './shared/constants.js';
import { stepEntity, type EntityState, type MoveInputLike } from './shared/movement.js';

dotenv.config();

const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 3000;

// --- Express: REST API routes (/api/health, /api/auth, /api/users, /api/friends) ---
const app = createApp();

// Express and Socket.IO share the same HTTP server (port 3000)
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  },
  path: '/socket.io/'
});

// --- Authoritative Game State (kept from main game loop) ---
interface Player extends EntityState {
  input: MoveInputLike;
}
const playersById = new Map<string, Player>();
let joinCount = 0;

io.on('connection', (socket) => {
  // Spawn position in spiral so players don't overlap
  const angle = joinCount++ * 2.399963;
  playersById.set(socket.id, {
    x: ARENA_WIDTH / 2 + Math.cos(angle) * 80,
    y: ARENA_HEIGHT / 2 + Math.sin(angle) * 80,
    vx: 0,
    vy: 0,
    input: { moveX: 0, moveY: 0 },
  });
  console.log(`[Socket.IO] ${socket.id} connected (${playersById.size} player(s))`);

  socket.on('input', (data: unknown) => {
    const player = playersById.get(socket.id);
    if (player) player.input = sanitizeInput(data);
  });

  socket.on('disconnect', (reason) => {
    playersById.delete(socket.id);
    console.log(`[Socket.IO] ${socket.id} disconnected (${reason})`);
  });
});

/** Never trust the client: anything other than -1/0/1 becomes 0. */
function sanitizeInput(data: unknown): MoveInputLike {
  const d = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>;
  return { moveX: toAxis(d.moveX), moveY: toAxis(d.moveY) };
}
function toAxis(value: unknown): -1 | 0 | 1 {
  return value === -1 || value === 1 ? value : 0;
}

// --- Game Loop: TICK_RATE ticks per second ---
const dt = 1 / TICK_RATE;
setInterval(() => {
  const state: Record<string, { x: number; y: number }> = {};
  for (const [id, player] of playersById) {
    stepEntity(player, player.input, dt);
    state[id] = { x: player.x, y: player.y };
  }
  io.emit('state', state);
}, 1000 / TICK_RATE);

// --- Startup & Database Connection ---
async function main() {
  try {
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL via Prisma ORM.');

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, async () => {
    console.log(`[Server] ${signal} received, shutting down gracefully...`);
    await prisma.$disconnect();
    io.close(() => process.exit(0));
  });
}
