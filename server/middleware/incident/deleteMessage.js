import statusCache from '../../cache/status.js';
import {
  fetchIncident,
  updateIncident,
} from '../../database/queries/incident.js';
import { handleError } from '../../utils/errors.js';

const deleteIncidentMessageMiddleware = async (request, response) => {
  const { incidentId, position } = request.body;

  try {
    if (!incidentId) {
      return response.status(400).json({ message: 'Incident id is required' });
    }

    const query = await fetchIncident(
      incidentId,
      response.locals.workspaceId
    );

    if (!query) {
      return response.status(404).json({ message: 'Incident not found' });
    }

    const parsedPosition = parseInt(position);
    const isValidPosition =
      parsedPosition >= 0 &&
      parsedPosition < query.messages.length &&
      query.messages[parsedPosition];

    if (!isValidPosition) {
      return response.status(404).json({ message: 'Message not found' });
    }

    if (query.messages.length === 1) {
      return response
        .status(404)
        .json({ message: 'Need to have at least one message' });
    }

    query.messages.splice(parsedPosition, 1);
    query.status = query.messages[query.messages.length - 1].status;

    const data = await updateIncident(
      incidentId,
      response.locals.workspaceId,
      query
    );

    statusCache.addIncident(data);

    return response.json(query);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default deleteIncidentMessageMiddleware;
