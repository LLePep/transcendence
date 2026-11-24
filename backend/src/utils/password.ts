import bcrypt from 'bcryptjs';

// Number of hashing rounds (industry standard security level)
const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password with salt so cleartext passwords are never stored.
 * Example: "mySecret123" -> "$2a$10$X8a..."
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies whether the password provided at login matches the hash stored in the database.
 * Returns true if the password matches, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
