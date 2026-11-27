import type { OnlinePlayer } from '../types/social';

export const MOCK_ONLINE_PLAYERS: OnlinePlayer[] = [
  {
    id: 'f1',
    username: 'PixelWarrior',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    currentActivity: 'En attente de match',
    elo: 1820,
  },
  {
    id: 'f2',
    username: 'QuantumBall',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'in_game',
    currentActivity: 'En combat d\'arène Battle Royale',
    elo: 1950,
  },
  {
    id: 'f3',
    username: 'ArcadeRider',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    currentActivity: 'Entraînement Solo',
    elo: 1640,
  },
  {
    id: 'f4',
    username: 'GhostMage',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    status: 'offline',
    elo: 1720,
  },
];
