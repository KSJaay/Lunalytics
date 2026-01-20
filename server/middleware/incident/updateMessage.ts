// import type definitions
import type { Request, Response } from 'express';

// import local files
import { incidentMessageValidator } from '../../../shared/validators/incident.js';
import statusCache from '../../cache/status.js';
import {
  fetchIncident,
  updateIncident,
} from '../../database/queries/incident.js';
import { handleError } from '../../utils/errors.js';

const updateIncidentMessageMiddleware = async (
  request: Request,
  response: Response
) => {
  const { message, status, monitorIds, incidentId, position } = request.body;

  try {
    if (!incidentId || typeof position === 'undefined') {
      return response.status(400).json({ message: 'Incident id is required' });
    }

    const isInvalid = incidentMessageValidator({ message, status, monitorIds });

    if (isInvalid) {
      return response.status(400).json({ message: isInvalid });
    }

    const query = await fetchIncident(incidentId, response.locals.workspaceId);

    if (!query) {
      return response.status(404).json({ message: 'Incident not found' });
    }

    if (!query.messages[position]) {
      return response.status(404).json({ message: 'Message not found' });
    }

    const { workspaceId } = response.locals;

    const incident = {
      ...query,
      status: status || query.status,
      monitorIds: monitorIds || query.monitorIds,
    };

    incident.messages[position] = {
      ...query.messages[position],
      message,
      status,
      email: response.locals.user.email,
      monitorIds: monitorIds || query.monitorIds,
    };

    const data = await updateIncident(incidentId, workspaceId, incident);

    statusCache.addIncident(data);

    return response.json(data);
  } catch (error: any) {
    handleError(error, response);
  }
};

export default updateIncidentMessageMiddleware;
