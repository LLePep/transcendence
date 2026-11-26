import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.js';

// Extend Express Request to include authenticated player payload
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware: authenticateToken
 * Security guard that intercepts incoming requests on protected routes.
 * It checks the 'Authorization: Bearer <token>' header, verifies the JWT,
 * and attaches the decoded player data to req.user.
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authHeader) {
    res.status(401).json({
      error: 'Access denied. No authentication token provided.'
    });
    return;
  }

  // Format should be: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      error: 'Invalid authorization format. Expected "Bearer <token>".'
    });
    return;
  }

  const token = parts[1];

  // Verify the token signature and expiration
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({
      error: 'Invalid or expired authentication token.'
    });
    return;
  }

  // Attach decoded player data to the request object
  req.user = decoded;

  // Let the request proceed to the next handler
  next();
}
