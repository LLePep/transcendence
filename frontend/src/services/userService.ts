import { apiClient } from './apiClient';
import type { User, UpdateProfilePayload } from '../types/auth';

export const userService = {
  /**
   * Get currently logged-in player profile and career stats.
   */
  async getMe(): Promise<User> {
    return apiClient<User>('/api/users/me', {
      method: 'GET',
    });
  },

  /**
   * Update profile details (username, bio).
   */
  async updateProfile(
    payload: UpdateProfilePayload
  ): Promise<{ message: string; user: User }> {
    return apiClient<{ message: string; user: User }>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Upload a new avatar image.
   */
  async uploadAvatar(file: File): Promise<{ message: string; avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient<{ message: string; avatarUrl: string }>(
      '/api/users/me/avatar',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  /**
   * Fetch public player profile and stats by user ID.
   */
  async getUserById(id: string): Promise<User> {
    return apiClient<User>(`/api/users/${id}`, {
      method: 'GET',
      requiresAuth: false,
    });
  },
};
