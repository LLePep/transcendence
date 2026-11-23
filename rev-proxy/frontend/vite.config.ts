import { defineConfig } from "vite";

// Uniquement pour `npm run dev` (hors Docker) : imite ce que fait nginx,
// en envoyant /api et /socket.io vers le backend lancé sur localhost:3000.
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/socket.io": { target: "http://localhost:3000", ws: true },
    },
  },
});
