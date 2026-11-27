import { apiClient } from './apiClient';
import type { Friend, FriendRequestsResponse } from '../types/friends';

export const friendsService = {
  /**
   * Get all accepted friends with their online status and rating.
   */
  async getFriends(): Promise<Friend[]> {
    return apiClient<Friend[]>('/api/friends', {
      method: 'GET',
    });
  },

  /**
   * Get pending incoming and outgoing friend requests.
   */
  async getFriendRequests(): Promise<FriendRequestsResponse> {
    return apiClient<FriendRequestsResponse>('/api/friends/requests', {
      method: 'GET',
    });
  },

  /**
   * Send a friend request to a player by username.
   */
  async sendFriendRequest(
    targetUsername: string
  ): Promise<{ message: string; friendship: any }> {
    return apiClient<{ message: string; friendship: any }>(
      '/api/friends/request',
      {
        method: 'POST',
        body: JSON.stringify({ targetUsername }),
      }
    );
  },

  /**
   * Accept an incoming friend request by request ID.
   */
  async acceptFriendRequest(
    requestId: string
  ): Promise<{ message: string; friendship: any }> {
    return apiClient<{ message: string; friendship: any }>(
      `/api/friends/${requestId}/accept`,
      {
        method: 'POST',
      }
    );
  },

  /**
   * Decline an incoming request or remove an existing friend.
   */
  async declineOrRemoveFriend(
    id: string
  ): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/friends/${id}/decline`, {
      method: 'POST',
    });
  },
};
