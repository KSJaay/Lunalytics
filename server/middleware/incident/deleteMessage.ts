// import type definitions
import type { Request, Response } from 'express';

// import local files
import statusCache from '../../cache/status.js';
import {
  fetchIncident,
  updateIncident,
} from '../../database/queries/incident.js';
import { handleError } from '../../utils/errors.js';
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';

const deleteIncidentMessageMiddleware = async (
  request: Request,
  response: Response
) => {
  const { incidentId, position } = request.body;

  try {
    if (!incidentId) {
      return response.status(400).json(INCIDENT_ERRORS.I004);
    }

    const query = await fetchIncident(incidentId, response.locals.workspaceId);

    if (!query) {
      return response.status(404).json(INCIDENT_ERRORS.I001);
    }

    const parsedPosition = parseInt(position);
    const isValidPosition =
      parsedPosition >= 0 &&
      parsedPosition < query.messages.length &&
      query.messages[parsedPosition];

    if (!isValidPosition) {
      return response
        .status(404)
        .json({ ...INCIDENT_ERRORS.I001, details: 'Message not found' });
    }

    if (query.messages.length === 1) {
      return response.status(400).json({
        ...INCIDENT_ERRORS.I003,
        details: 'Need to have at least one message',
      });
    }

    query.messages.splice(parsedPosition, 1);
    query.status = query.messages[query.messages.length - 1].status;

    const { workspaceId } = response.locals;

    const data = await updateIncident(incidentId, workspaceId, query);

    statusCache.addIncident(data);

    return response.json(query);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default deleteIncidentMessageMiddleware;
