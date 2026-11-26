import { PrismaClient } from '@prisma/client';

// Single shared Prisma Client instance used across the entire backend
export const prisma = new PrismaClient();
