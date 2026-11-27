import type { PlatformStats } from '../types/stats';
import { apiClient } from './apiClient';

/**
 * Service providing real platform statistics directly from backend.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  const startTime = performance.now();
  try {
    const data = await apiClient<PlatformStats>('/api/stats', {
      method: 'GET',
      requiresAuth: false,
    });
    const roundTripLatency = Math.round(performance.now() - startTime);
    return {
      activePlayersCount: data.activePlayersCount ?? 0,
      matchesPlayedTotal: data.matchesPlayedTotal ?? 0,
      serverLatencyMs: roundTripLatency,
    };
  } catch (error) {
    console.error('[StatsService] Failed to fetch stats:', error);
    return {
      activePlayersCount: 0,
      matchesPlayedTotal: 0,
      serverLatencyMs: 0,
    };
  }
}
