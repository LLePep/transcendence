#!/bin/sh
set -e

mkdir -p /app/uploads/avatars

if [ ! -f /app/uploads/default-avatar.svg ] && [ -f /app/default-avatar.svg ]; then
  cp /app/default-avatar.svg /app/uploads/default-avatar.svg
fi

echo "[Backend] Syncing database schema with Prisma ORM..."
npx prisma db push --skip-generate

echo "[Backend] Starting server..."
exec node dist/server.js
