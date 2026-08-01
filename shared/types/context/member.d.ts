import type Role from '../../../shared/permissions/role';

export interface ContextMemberProps {
  email: string;
  workspaceId: string;
  permission: number;
  created_at: string;
  updated_at: string;
  role: Role;
}
