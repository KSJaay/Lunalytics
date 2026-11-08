// import type definitions
import type { Request, Response } from 'express';

// import local files
import { fetchConnections } from '../../../database/queries/connection.js';
import { handleError } from '../../../utils/errors.js';

const getAllConnectionMiddleware = async (
  _request: Request,
  response: Response
) => {
  try {
    const connections = await fetchConnections(response.locals.user.email);

    response.status(200).json(connections);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default getAllConnectionMiddleware;
