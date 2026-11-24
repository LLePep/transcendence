import jwt from 'jsonwebtoken';

// Secret signing key (configured in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_transcendence_secret_key_change_in_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  username: string;
}

/**
 * Creates a signed JSON Web Token (JWT) containing player's ID and username.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifies the authenticity of a JWT token.
 * Returns the payload { userId, username } if valid, or null if expired or tampered.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (_error) {
    return null;
  }
}
