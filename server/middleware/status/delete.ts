import statusCache from '../../cache/status.js';
import { deleteStatusPage } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const deleteStatusPageMiddleware = async (request, response) => {
  const { statusPageId } = request.body;

  try {
    if (!statusPageId) {
      throw new Error('Status page id is required.');
    }

    await deleteStatusPage(statusPageId, response.locals.workspaceId);
    statusCache.deleteStatusPage(statusPageId);

    response.status(200).send({
      message: 'Status page deleted successfully!',
    });
  } catch (error) {
    if (!response.headersSent) {
      if (error instanceof Error) {
        response.status(400).send({
          message: error.message,
        });
      }
    }

    handleError(error, response);
  }
};

export default deleteStatusPageMiddleware;
