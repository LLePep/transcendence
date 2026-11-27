import type { LeaderboardEntry } from '../types/leaderboard';
import { apiClient } from './apiClient';

/**
 * Service providing leaderboard data directly from backend Prisma ORM.
 * Strictly limited to the top 100 players.
 */
export async function getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  try {
    const data = await apiClient<LeaderboardEntry[]>(`/api/users/leaderboard?limit=${safeLimit}`, {
      method: 'GET',
      requiresAuth: false,
    });
    return data.slice(0, 100);
  } catch (error) {
    console.error('[LeaderboardService] Failed to fetch leaderboard:', error);
    return [];
  }
}

export async function getLeaderboardPreview(): Promise<LeaderboardEntry[]> {
  return getLeaderboard(4);
}
