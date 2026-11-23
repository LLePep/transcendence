export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  isOnline: boolean;
}
