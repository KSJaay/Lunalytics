import { fetchAllInvites } from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';

const getAllInvitesMiddleware = async (request, response) => {
  try {
    const invites = await fetchAllInvites(response.locals.workspaceId);

    return response.status(200).send({ invites });
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllInvitesMiddleware;
