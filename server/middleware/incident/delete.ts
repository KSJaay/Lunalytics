import statusCache from '../../cache/status.js';
import { deleteIncident } from '../../database/queries/incident.js';
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';

const deleteIncidentMiddleware = async (request, response) => {
  const { incidentId } = request.body;

  try {
    if (!incidentId) {
      return response.status(400).json(INCIDENT_ERRORS.I004);
    }

    await deleteIncident(incidentId, response.locals.workspaceId);
    statusCache.deleteIncident(incidentId, response.locals.workspaceId);

    return response
      .status(200)
      .json({ message: 'Incident deleted successfully' });
  } catch (error) {
    response
      .status(400)
      .json({ ...INCIDENT_ERRORS.I003, details: error.message });
  }
};

export default deleteIncidentMiddleware;
