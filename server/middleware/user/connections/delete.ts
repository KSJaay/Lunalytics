// import type definitions
import type { Request, Response } from 'express';

// import local files
import { deleteConnection } from '../../../database/queries/connection.js';
import { handleError } from '../../../utils/errors.js';

const deleteConnectionMiddleware = async (
  request: Request,
  response: Response
) => {
  const { provider } = request.body;

  try {
    if (!provider) {
      return response.status(400).json({ error: 'Provider is required' });
    }

    await deleteConnection(response.locals.user.email, provider);
    response.sendStatus(204);
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteConnectionMiddleware;
