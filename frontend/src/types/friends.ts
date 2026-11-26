import type { UserStatus } from './auth';

export interface FriendSummary {
  id: string;
  username: string;
  avatarUrl: string | null;
  status: UserStatus;
  stats?: {
    rating: number;
    wins: number;
  };
}

export interface Friend extends FriendSummary {
  friendshipId: string;
  friendsSince: string;
}

export interface FriendRequestItem {
  requestId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
    status: UserStatus;
  };
}

export interface FriendRequestsResponse {
  incoming: FriendRequestItem[];
  outgoing: FriendRequestItem[];
}
