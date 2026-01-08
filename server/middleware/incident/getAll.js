import { fetchAllIncidents } from '../../database/queries/incident.js';
import logger from '../../utils/logger.js';

const getAllIncidents = async (request, response) => {
  try {
    const incidents = await fetchAllIncidents(response.locals.user.workspaceId);

    return response.json(incidents);
  } catch (error) {
    logger.error('Error fetching all incidents', {
      message: error.message,
      stack: error.stack,
    });

    return response.status(500).send({
      message: 'Something went wrong',
    });
  }
};

export default getAllIncidents;
