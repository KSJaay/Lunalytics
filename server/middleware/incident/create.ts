// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';
import { createIncident } from '../../database/queries/incident.js';
import IncidentValidator from '../../../shared/validators/incident.js';
import statusCache from '../../cache/status.js';

const createIncidentMiddleware = async (
  request: Request,
  response: Response
) => {
  try {
    const { body } = request;

    const isInvalid = IncidentValidator(body);

    if (isInvalid) {
      return response
        .status(400)
        .json({ ...INCIDENT_ERRORS.I003, details: isInvalid });
    }

    const data = {
      title: body.title,
      monitorIds: body.monitorIds,
      affect: body.affect,
      status: body.status,
      messages: [] as Array<{
        message: any;
        status: any;
        email: any;
        created_at: string;
        endedAt: null;
        monitorIds: any;
      }>,
      created_at: new Date().toISOString(),
      completedAt: null,
      isClosed: false,
    };

    const msg = {
      message: body.message,
      status: body.status,
      email: response.locals.user.email,
      created_at: new Date().toISOString(),
      endedAt: null,
      monitorIds: body.monitorIds,
    };

    data.messages.push(msg);

    const { workspaceId } = response.locals;

    const incident = await createIncident(data, workspaceId);

    statusCache.addIncident(incident);

    return response.json(incident);
  } catch (error) {
    handleError(error, response);
  }
};

export default createIncidentMiddleware;
