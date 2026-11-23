import type { OnlinePlayer } from '../types/social';
import { MOCK_ONLINE_PLAYERS } from '../mocks/socialMock';

/**
 * Service providing online friends/players preview without external network calls.
 */
export async function getOnlinePlayersPreview(): Promise<OnlinePlayer[]> {
  // Simulates an async service call using typed mock data
  return Promise.resolve([...MOCK_ONLINE_PLAYERS]);
}
