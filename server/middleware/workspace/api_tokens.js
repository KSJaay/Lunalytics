import { handleError } from '../../utils/errors.js';
import { getAllApiTokens } from '../../database/queries/tokens.js';

const workspaceApiTokensMiddleware = async (request, response) => {
  try {
    const tokens = await getAllApiTokens(response.locals.workspaceId);

    return response.json(tokens);
  } catch (error) {
    handleError(error, response);
  }
};

export default workspaceApiTokensMiddleware;
