export interface ContextInviteProps {
  created_at: string;
  email: string;
  expiresAt: string | null;
  limit: number | null;
  paused: boolean;
  permission: number;
  token: string;
  uses: number;
}
