import type { OnlinePlayer } from '../types/social';
import { apiClient, getStoredToken } from './apiClient';

/**
 * Service providing online friends directly from backend Prisma ORM.
 */
export async function getOnlineFriends(): Promise<OnlinePlayer[]> {
  const token = getStoredToken();
  if (!token) {
    return [];
  }
  try {
    return await apiClient<OnlinePlayer[]>('/api/friends/online', {
      method: 'GET',
      requiresAuth: true,
    });
  } catch (error) {
    console.error('[SocialService] Failed to fetch online friends:', error);
    return [];
  }
}

export async function getOnlinePlayersPreview(): Promise<OnlinePlayer[]> {
  return getOnlineFriends();
}
