import { MemberPermissionBits } from '../../../../shared/permissions/bitFlags.js';
import Role from '../../../../shared/permissions/role.js';
import { fetchMembers } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const teamMembersListMiddleware = async (request, response) => {
  try {
    const { member } = response.locals;

    const role = new Role('member', member.permission);
    const userHasManageTeam = role.hasPermission(
      MemberPermissionBits.MANAGE_TEAM
    );

    const members = await fetchMembers(
      userHasManageTeam,
      response.locals.workspaceId
    );

    return response.send(members);
  } catch (error) {
    handleError(error, response);
  }
};

export default teamMembersListMiddleware;
