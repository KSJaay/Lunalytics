import statusCache from '../../cache/status.js';
import { deleteIncident } from '../../database/queries/incident.js';

const deleteIncidentMiddleware = async (request, response) => {
  const { incidentId } = request.body;

  try {
    if (!incidentId) {
      throw new Error('Incident id is required');
    }

    await deleteIncident(incidentId, response.locals.user.workspaceId);
    statusCache.deleteIncident(incidentId, response.locals.user.workspaceId);

    return response
      .status(200)
      .json({ message: 'Incident deleted successfully' });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

export default deleteIncidentMiddleware;
