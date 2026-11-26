export type UserStatus = 'OFFLINE' | 'ONLINE' | 'IN_GAME';

export interface UserStats {
  id?: string;
  userId?: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  kills: number;
  deaths: number;
  highestScore: number;
  xp: number;
  level: number;
  rating: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
  stats?: UserStats;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
}
