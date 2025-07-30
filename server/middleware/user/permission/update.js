import Role from '../../../../shared/permissions/role.js';
import { handleError } from '../../../utils/errors.js';
import { updateUserPermission } from '../../../database/queries/user.js';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags.js';
import { isValidBitFlags } from '../../../../shared/permissions/isValidBitFlags.js';

const permissionUpdateMiddleware = async (request, response) => {
  try {
    const { user } = response.locals;
    const { email, permission } = request.body;

    if (!email) {
      return response.status(400).send({ message: 'Email is required' });
    }

    if (!isValidBitFlags(permission)) {
      return response
        .status(400)
        .send({ message: 'Invalid permission format' });
    }

    const role = new Role('user', permission);

    if (role.hasPermission(PermissionsBits.ADMINISTRATOR) && !user.isOwner) {
      return response
        .status(400)
        .send({ message: 'Only owner can give administrator permission' });
    }

    await updateUserPermission(email, permission);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default permissionUpdateMiddleware;
