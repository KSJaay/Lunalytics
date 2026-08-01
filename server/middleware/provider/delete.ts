// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { deleteProvider } from '../../database/queries/provider.js';

const deleteProviderMiddleware = async (
  request: Request,
  response: Response
) => {
  const { provider } = request.body;

  try {
    await deleteProvider(provider);
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteProviderMiddleware;
