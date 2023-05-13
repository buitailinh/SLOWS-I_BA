export type FriendRequest_Status = 'Follower' | 'Following' | 'Friend' | 'Block' | '';
export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}
