import { handleError } from '../../utils/errors.js';
import { createIncident } from '../../database/queries/incident.js';
import IncidentValidator from '../../../shared/validators/incident.js';
import statusCache from '../../cache/status.js';

const createIncidentMiddleware = async (request, response) => {
  try {
    const { body } = request;

    const isInvalid = IncidentValidator(body);

    if (isInvalid) {
      return response.status(400).json({ message: isInvalid });
    }

    const data = {
      title: body.title,
      monitorIds: body.monitorIds,
      affect: body.affect,
      status: body.status,
      messages: [],
      createdAt: new Date().toISOString(),
      completedAt: null,
      isClosed: false,
    };

    const msg = {
      message: body.message,
      status: body.status,
      email: response.locals.user.email,
      createdAt: new Date().toISOString(),
      endedAt: null,
      monitorIds: body.monitorIds,
    };

    data.messages.push(msg);

    const incident = await createIncident(data);

    statusCache.addIncident(incident);

    return response.json(incident);
  } catch (error) {
    handleError(error, response);
  }
};

export default createIncidentMiddleware;
