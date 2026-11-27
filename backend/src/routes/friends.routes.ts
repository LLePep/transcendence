import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const friendsRouter = Router();

// Validation schema for sending a friend request
const sendRequestSchema = z.object({
  targetUsername: z.string().min(1, 'Target username is required')
});

/**
 * Route: GET /api/friends
 * Description: List all accepted friends for the authenticated player,
 * including their avatar and live online status (OFFLINE, ONLINE, IN_GAME).
 */
friendsRouter.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;

    // A friendship can be accepted where current user is either requester or addressee
    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: currentUserId },
          { addresseeId: currentUserId }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            status: true,
            stats: {
              select: {
                rating: true,
                wins: true
              }
            }
          }
        },
        addressee: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            status: true,
            stats: {
              select: {
                rating: true,
                wins: true
              }
            }
          }
        }
      }
    });

    // Map friendships to return the other user's profile
    const friends = friendships.map((f) => {
      const friendData = f.requesterId === currentUserId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        ...friendData,
        friendsSince: f.updatedAt
      };
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error('[Friends Error] GET /:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: GET /api/friends/requests
 * Description: List pending incoming and outgoing friend requests
 */
friendsRouter.get('/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;

    // Incoming requests (waiting for my approval)
    const incoming = await prisma.friendship.findMany({
      where: {
        addresseeId: currentUserId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            status: true
          }
        }
      }
    });

    // Outgoing requests (sent by me, waiting for their approval)
    const outgoing = await prisma.friendship.findMany({
      where: {
        requesterId: currentUserId,
        status: 'PENDING'
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            status: true
          }
        }
      }
    });

    res.status(200).json({
      incoming: incoming.map((item) => ({
        requestId: item.id,
        createdAt: item.createdAt,
        user: item.requester
      })),
      outgoing: outgoing.map((item) => ({
        requestId: item.id,
        createdAt: item.createdAt,
        user: item.addressee
      }))
    });
  } catch (error) {
    console.error('[Friends Error] GET /requests:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: POST /api/friends/request
 * Description: Send a friend request to another player by username
 */
friendsRouter.post('/request', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = sendRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0].message
      });
      return;
    }

    const currentUserId = req.user!.userId;
    const { targetUsername } = parseResult.data;

    // Find target player by username
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername }
    });

    if (!targetUser) {
      res.status(404).json({ error: 'Player not found.' });
      return;
    }

    // Prevent adding yourself
    if (targetUser.id === currentUserId) {
      res.status(400).json({ error: 'You cannot send a friend request to yourself.' });
      return;
    }

    // Check for existing relationship in either direction
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: targetUser.id },
          { requesterId: targetUser.id, addresseeId: currentUserId }
        ]
      }
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        res.status(400).json({ error: 'You are already friends with this player.' });
        return;
      }
      if (existing.status === 'PENDING') {
        if (existing.requesterId === currentUserId) {
          res.status(400).json({ error: 'You have already sent a friend request to this player.' });
          return;
        } else {
          // If the other player already sent a request to me, automatically accept it
          const updated = await prisma.friendship.update({
            where: { id: existing.id },
            data: { status: 'ACCEPTED' }
          });
          res.status(200).json({
            message: 'Mutual friend request detected! You are now friends.',
            friendship: updated
          });
          return;
        }
      }
      if (existing.status === 'BLOCKED') {
        res.status(400).json({ error: 'Unable to send friend request.' });
        return;
      }
    }

    // Create new pending friendship
    const newFriendship = await prisma.friendship.create({
      data: {
        requesterId: currentUserId,
        addresseeId: targetUser.id,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      message: 'Friend request sent successfully!',
      friendship: newFriendship
    });
  } catch (error) {
    console.error('[Friends Error] POST /request:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: POST /api/friends/:id/accept
 * Description: Accept an incoming friend request
 */
friendsRouter.post('/:id/accept', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const id = String(req.params.id);

    const friendship = await prisma.friendship.findUnique({
      where: { id }
    });

    if (!friendship || friendship.addresseeId !== currentUserId) {
      res.status(404).json({ error: 'Friend request not found or unauthorized.' });
      return;
    }

    if (friendship.status === 'ACCEPTED') {
      res.status(400).json({ error: 'This friend request has already been accepted.' });
      return;
    }

    const updated = await prisma.friendship.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    res.status(200).json({
      message: 'Friend request accepted!',
      friendship: updated
    });
  } catch (error) {
    console.error('[Friends Error] POST /:id/accept:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

/**
 * Route: POST /api/friends/:id/decline
 * Description: Decline an incoming friend request or remove existing friend
 */
friendsRouter.post('/:id/decline', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.userId;
    const id = String(req.params.id);

    const friendship = await prisma.friendship.findUnique({
      where: { id }
    });

    if (
      !friendship ||
      (friendship.requesterId !== currentUserId && friendship.addresseeId !== currentUserId)
    ) {
      res.status(404).json({ error: 'Friendship or request not found.' });
      return;
    }

    await prisma.friendship.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Friend request declined or removed.'
    });
  } catch (error) {
    console.error('[Friends Error] POST /:id/decline:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});
