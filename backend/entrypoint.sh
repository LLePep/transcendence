#!/bin/sh
set -e

echo "[Backend] Waiting for PostgreSQL to be reachable..."
until nc -z postgres 5432; do
  echo "[Backend] PostgreSQL is unavailable - retrying in 1s..."
  sleep 1
done
echo "[Backend] PostgreSQL is ready."

echo "[Backend] Generating Prisma Client..."
npx prisma generate

if [ -d "./prisma/migrations" ] && [ "$(ls -A ./prisma/migrations 2>/dev/null)" ]; then
  echo "[Backend] Applying Prisma migrations..."
  npx prisma migrate deploy
else
  echo "[Backend] No migrations found yet - syncing schema with prisma db push..."
  npx prisma db push
fi

echo "[Backend] Starting development server..."
exec npm run dev
