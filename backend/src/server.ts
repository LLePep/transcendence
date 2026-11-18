import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { prisma } from './db.js';

// Load environment variables from .env into process.env
dotenv.config();

const port = Number(process.env.BACKEND_PORT) || 3000;
const app = createApp();

// Create a Node.js HTTP server that passes regular HTTP requests to Express
const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server to handle WebSocket connections
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  path: '/socket.io/'
});

// Handle real-time client connections
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('ping', () => {
    socket.emit('pong', {
      message: 'pong from backend',
      time: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

async function main() {
  try {
    // Verify database connectivity before accepting traffic
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL via Prisma ORM.');

    // Listen on 0.0.0.0 so other Docker containers (like Nginx) can reach it
    server.listen(port, '0.0.0.0', () => {
      console.log(`[Server] Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

main();
