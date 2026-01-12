import { isValidBitFlags } from '../../../shared/permissions/isValidBitFlags.js';
import { createInvite } from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';

const createInviteMiddleware = async (request, response) => {
  try {
    const { expiry, limit, permission } = request.body;

    const {
      user: { email },
    } = response.locals;

    if (!permission || !isValidBitFlags(permission)) {
      return response.status(400).send({
        message: 'Invalid permission flags provided',
      });
    }

    const invite = await createInvite(
      email,
      expiry,
      limit,
      permission,
      response.locals.workspaceId
    );

    return response.status(200).send({ invite });
  } catch (error) {
    handleError(error, response);
  }
};

export default createInviteMiddleware;
