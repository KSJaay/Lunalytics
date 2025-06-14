import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { fetchIncident } from '../../database/queries/incident.js';

const fetchIncidentUsingId = async (request, response) => {
  try {
    const { incidentId } = request.query;

    if (!incidentId) {
      throw new UnprocessableError('No incidentId provided');
    }

    const data = await fetchIncident(incidentId);

    if (!data) {
      return response.status(404).json({ error: 'Incident not found' });
    }

    return response.json(data);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchIncidentUsingId;
