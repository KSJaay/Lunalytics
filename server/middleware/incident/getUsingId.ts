import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { fetchIncident } from '../../database/queries/incident.js';
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';

const fetchIncidentUsingId = async (request, response) => {
  try {
    const { incidentId } = request.query;

    if (!incidentId) {
      return response.status(400).json(INCIDENT_ERRORS.I004);
    }

    const data = await fetchIncident(incidentId);

    if (!data) {
      return response.status(404).json(INCIDENT_ERRORS.I001);
    }

    return response.json(data);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchIncidentUsingId;
