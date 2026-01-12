import { getAllApiTokens } from '../../database/queries/tokens.js';
import { handleError } from '../../utils/errors.js';

const getAllApiTokensMiddleware = async (request, response) => {
  try {
    const tokens = await getAllApiTokens(response.locals.workspaceId);

    return response.status(200).json({ tokens });
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllApiTokensMiddleware;
