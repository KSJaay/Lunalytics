// import type definitions
import type { Request, Response } from 'express';

// import local files
import { MemberPermissionBits } from '../../../../shared/permissions/bitFlags.js';
import Role from '../../../../shared/permissions/role.js';
import { fetchMembers } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const teamMembersListMiddleware = async (
  request: Request,
  response: Response
) => {
  try {
    const { member } = response.locals;

    const role = new Role('member', member.permission);
    const memberHasManageTeam = role.hasPermission(
      MemberPermissionBits.MANAGE_TEAM
    );

    const members = await fetchMembers(
      memberHasManageTeam,
      response.locals.workspaceId
    );

    return response.send(members);
  } catch (error) {
    handleError(error, response);
  }
};

export default teamMembersListMiddleware;
