// import type definitions
import type { Request, Response } from 'express';

// import local files
import { fetchAllInvites } from '../../database/queries/invite.js';
import { handleError } from '../../utils/errors.js';

const getAllInvitesMiddleware = async (
  _request: Request,
  response: Response
) => {
  try {
    const invites = await fetchAllInvites(response.locals.workspaceId);

    return response.status(200).send({ invites });
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllInvitesMiddleware;
