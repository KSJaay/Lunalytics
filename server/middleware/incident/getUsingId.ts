// import type definitions
import { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { fetchIncident } from '../../database/queries/incident.js';
import { INCIDENT_ERRORS } from '../../../shared/constants/errors/incident.js';

const fetchIncidentUsingId = async (request: Request, response: Response) => {
  try {
    const { incidentId } = request.query;
    const { workspaceId } = response.locals;

    if (!incidentId) {
      return response.status(400).json(INCIDENT_ERRORS.I004);
    }

    const data = await fetchIncident(incidentId as string, workspaceId);

    if (!data) {
      return response.status(404).json(INCIDENT_ERRORS.I001);
    }

    return response.json(data);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchIncidentUsingId;
