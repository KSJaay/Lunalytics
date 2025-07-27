import {
  deleteInvite,
  fetchInviteUsingId,
} from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';

const deleteInviteMiddleware = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).send({
        message: 'No invite id provided',
      });
    }

    const invite = await fetchInviteUsingId(id);

    if (!invite) {
      return response.status(404).send({
        message: 'Invite not found',
      });
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
