import IncidentValidator from '../../../shared/validators/incident.js';
import statusCache from '../../cache/status.js';
import { updateIncident } from '../../database/queries/incident.js';

const updateIncidentMiddleware = async (request, response) => {
  const { incident } = request.body;

  try {
    const isInvalid = IncidentValidator(incident);

    if (isInvalid) {
      return response.status(400).json({ message: isInvalid });
    }

    if (
      incident.messages[incident.messages.length - 2] &&
      !incident.messages[incident.messages.length - 2]?.endedAt
    ) {
      incident.messages[incident.messages.length - 2].endedAt =
        new Date().toISOString();
    }

    const query = await updateIncident(incident.incidentId, incident);

    statusCache.addIncident(query);

    return response.json(query);
  } catch (error) {
    console.log(error);
  }
};

export default updateIncidentMiddleware;
