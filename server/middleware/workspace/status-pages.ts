import { fetchWorkspaceStatusPages } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const getAllStatusPagesMiddleware = async (request, response) => {
  try {
    const query = await fetchWorkspaceStatusPages(response.locals.workspaceId);

    return response.json(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllStatusPagesMiddleware;
