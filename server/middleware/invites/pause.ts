import {
  fetchInviteUsingId,
  pauseInvite,
} from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';
import { INVITE_ERRORS } from '../../../shared/constants/errors/invite.js';

const pauseInviteMiddleware = async (request, response) => {
  try {
    const { id, paused } = request.body;

    if (!id) {
      return response.status(400).send(INVITE_ERRORS.I004);
    }

    const invite = await fetchInviteUsingId(id);

    if (!invite) {
      return response.status(404).send(INVITE_ERRORS.I001);
    }

    await pauseInvite(id, paused);

    return response.status(200).send({
      message: 'Invite has been paused successfully',
    });
  } catch (error) {
    handleError(error, response);
  }
};

export default pauseInviteMiddleware;
