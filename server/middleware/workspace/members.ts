// import type definitions
import type { Request, Response } from 'express';
import Role from '../../../shared/permissions/role.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { fetchWorkspaceMembers } from '../../database/queries/workspace.js';

const workspaceMembersMiddleware = async (
  _request: Request,
  response: Response
) => {
  const { workspaceId, member } = response.locals;

  const role = new Role('member', member.permission);

  const memberHasManageTeamPermission = role.hasPermission(
    MemberPermissionBits.MANAGE_TEAM
  );

  const members = await fetchWorkspaceMembers(
    memberHasManageTeamPermission,
    workspaceId
  );

  return response.send(members);
};

export default workspaceMembersMiddleware;
