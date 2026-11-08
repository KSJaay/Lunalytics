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
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';

const createIncidentMessageMiddleware = async (
  request: Request,
  response: Response
) => {
  const { message, status, monitorIds, incidentId } = request.body;

  try {
    if (!incidentId) {
      return response.status(400).json(INCIDENT_ERRORS.I004);
    }

    const isInvalid = incidentMessageValidator({ message, status, monitorIds });

    if (isInvalid) {
      return response
        .status(400)
        .json({ ...INCIDENT_ERRORS.I003, details: isInvalid });
    }

    const { workspaceId } = response.locals;

    const query = await fetchIncident(incidentId, workspaceId);

    if (!query) {
      return response.status(404).json(INCIDENT_ERRORS.I001);
    }

    const incident = {
      ...query,
      status: status || query.status,
      monitorIds: monitorIds || query.monitorIds,
      messages: [
        ...query.messages,
        {
          message,
          status,
          email: response.locals.user.email,
          created_at: new Date().toISOString(),
          endedAt: null,
          monitorIds: monitorIds || query.monitorIds,
        },
      ],
    };

    if (
      incident.messages[incident.messages.length - 2] &&
      !incident.messages[incident.messages.length - 2]?.endedAt
    ) {
      incident.messages[incident.messages.length - 2].endedAt =
        new Date().toISOString();
    }

    const data = await updateIncident(incidentId, workspaceId, incident);

    statusCache.addIncident(data);

    return response.json(data);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default createIncidentMessageMiddleware;
