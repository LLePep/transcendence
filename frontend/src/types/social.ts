export type PlayerStatus = 'online' | 'in_game' | 'offline';

export interface OnlinePlayer {
  id: string;
  username: string;
  avatarUrl: string;
  status: PlayerStatus;
  currentActivity?: string;
  elo: number;
}
