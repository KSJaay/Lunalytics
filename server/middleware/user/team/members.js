import { PermissionsBits } from '../../../../shared/permissions/bitFlags.js';
import Role from '../../../../shared/permissions/role.js';
import { fetchMembers } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const teamMembersListMiddleware = async (request, response) => {
  try {
    const { user } = response.locals;

    const role = new Role('user', user.permission);
    const userHasManageTeam = role.hasPermission(PermissionsBits.MANAGE_TEAM);

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
