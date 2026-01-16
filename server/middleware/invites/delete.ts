import {
  deleteInvite,
  fetchInviteUsingId,
} from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';
import { INVITE_ERRORS } from '../../../shared/constants/errors/invite.js';

const deleteInviteMiddleware = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).send(INVITE_ERRORS.I004);
    }

    const invite = await fetchInviteUsingId(id);

    if (!invite) {
      return response.status(404).send(INVITE_ERRORS.I001);
    }

    await deleteInvite(id);

    return response.status(200).send({
      message: 'Invite has been deleted successfully',
    });
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteInviteMiddleware;
