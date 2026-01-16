import { handleError } from '../../utils/errors.js';
import { getAllApiTokens } from '../../database/queries/tokens.js';
import { API_TOKEN_ERRORS } from '../../../shared/constants/errors/apiToken.js';

const workspaceApiTokensMiddleware = async (request, response) => {
  try {
    const tokens = await getAllApiTokens(response.locals.workspaceId);
    if (!tokens || tokens.length === 0) {
      return response.status(404).json(API_TOKEN_ERRORS.AT003);
    }
    return response.json(tokens);
  } catch (error) {
    handleError(error, response);
  }
};

export default workspaceApiTokensMiddleware;
