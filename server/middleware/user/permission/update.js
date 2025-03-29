import { PermissionsBits } from '../../../../shared/permissions/bitFlags.js';
import { oldPermsToFlags } from '../../../../shared/permissions/oldPermsToFlags.js';
import Role from '../../../../shared/permissions/role.js';
// import { isValidPermission } from '../../../../shared/permissions/validate.js';
import { updateUserPermission } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const permissionUpdateMiddleware = async (request, response) => {
  try {
    const { user } = response.locals;

    const role = new Role('user', user.permission);

    if (!role.hasPermission(PermissionsBits.ADMINISTRATOR)) {
      return response.sendStatus(401);
    }

    const { email, permission: bodyPermission } = request.body;

    if (!email || !oldPermsToFlags[bodyPermission]) {
      return response.sendStatus(400);
    }

    const permission = oldPermsToFlags[bodyPermission];

    if (permission === PermissionsBits.ADMINISTRATOR) {
      return response
        .status(400)
        .send('You cannot change this user permission.');
    }

    // if (!isValidPermission(permission)) {
    //   return response.sendStatus(400);
    // }

    await updateUserPermission(email, bodyPermission);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default permissionUpdateMiddleware;
