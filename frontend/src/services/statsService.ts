import type { PlatformStats } from '../types/stats';
import { MOCK_PLATFORM_STATS } from '../mocks/statsMock';

/**
 * Service providing global platform statistics without external network calls.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  // Simulates an async service call using typed mock data
  return Promise.resolve({ ...MOCK_PLATFORM_STATS });
}
