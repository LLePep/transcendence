import type { LeaderboardEntry } from '../types/leaderboard';
import { MOCK_LEADERBOARD } from '../mocks/leaderboardMock';

/**
 * Service providing leaderboard preview data without external network calls.
 */
export async function getLeaderboardPreview(): Promise<LeaderboardEntry[]> {
  // Simulates an async service call using typed mock data
  return Promise.resolve([...MOCK_LEADERBOARD]);
}
