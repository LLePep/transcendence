import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const authRouter = Router();

// 1. Validation schema for registration (Zod)
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, hyphens, and underscores'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

// 2. Validation schema for login (Zod)
const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Route: POST /api/auth/register
 * Description: Register a new player account
 */
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    // A. Validate input payload
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { username, email, password } = parseResult.data;

    // B. Check if username or email is already registered in database
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      res.status(400).json({ error: `${field} is already in use.` });
      return;
    }

    // C. Hash password
    const passwordHash = await hashPassword(password);

    // D. Create user and initialize statistics in PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        passwordHash,
        stats: {
          create: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            kills: 0,
            deaths: 0,
            highestScore: 0,
            xp: 0,
            level: 1,
            rating: 1000 // Default initial ranking score
          }
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        status: true,
        createdAt: true
      }
    });

    // E. Generate JWT session token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username
    });

    res.status(201).json({
      message: 'Account successfully created!',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('[Auth Error] /register:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: POST /api/auth/login
 * Description: Authenticate an existing player
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    // A. Validate input payload
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const { identifier, password } = parseResult.data;

    // B. Find user by email or username in database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier }
        ]
      }
    });

    // C. Verify user existence
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // D. Verify password using bcrypt
    const passwordValid = await comparePassword(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // E. Generate JWT session token
    const token = generateToken({
      userId: user.id,
      username: user.username
    });

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('[Auth Error] /login:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});
