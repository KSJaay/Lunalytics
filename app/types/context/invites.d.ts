export interface ContextInviteProps {
  createdAt: string;
  email: string;
  expiresAt: string | null;
  limit: number | null;
  paused: boolean;
  permission: number;
  token: string;
  uses: number;
}
