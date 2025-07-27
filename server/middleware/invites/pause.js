import { handleError } from '../../utils/errors.js';

const pauseInviteMiddleware = async (request, response) => {
  try {
    const { id, paused } = request.body;

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

    await pauseInvite(id, paused);

    return response.status(200).send({
      message: 'Invite has been paused successfully',
    });
  } catch (error) {
    handleError(error, response);
  }
};

export default pauseInviteMiddleware;
