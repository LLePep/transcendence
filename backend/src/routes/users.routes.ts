import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const usersRouter = Router();

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage for avatar image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: AuthenticatedRequest, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${req.user?.userId || 'unknown'}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Filter allowed image MIME types
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Max file size: 3MB
  fileFilter
});

// Profile update validation schema
const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, hyphens, and underscores')
    .optional(),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters').optional()
});

/**
 * Route: GET /api/users/me
 * Description: Get current authenticated player profile with stats
 */
usersRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        status: true,
        createdAt: true,
        stats: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Player profile not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[Users Error] GET /me:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: PATCH /api/users/me
 * Description: Update current player profile (username, bio)
 */
usersRouter.patch('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.errors[0].message
      });
    }

    const { username, bio } = parseResult.data;

    // Check if new username is already taken by another player
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: req.user!.userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'This username is already in use.' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(username ? { username } : {}),
        ...(bio !== undefined ? { bio } : {})
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        status: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('[Users Error] PATCH /me:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: POST /api/users/me/avatar
 * Description: Upload a new profile avatar image
 */
usersRouter.post(
  '/me/avatar',
  authenticateToken,
  upload.single('avatar'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please select an image file to upload.' });
      }

      // Public URL path served by Nginx / Express
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      const updatedUser = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { avatarUrl },
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      });

      return res.status(200).json({
        message: 'Avatar uploaded successfully!',
        avatarUrl: updatedUser.avatarUrl
      });
    } catch (error: any) {
      console.error('[Users Error] POST /me/avatar:', error);
      return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
  }
);

/**
 * Route: GET /api/users/:id
 * Description: View public profile and career stats of any player by ID
 */
usersRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        status: true,
        createdAt: true,
        stats: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[Users Error] GET /:id:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});
