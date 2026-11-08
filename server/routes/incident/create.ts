import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createIncidentMiddleware from '../../middleware/incident/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/create',
    summary: 'Create Incident',
    description:
      'Creates a new incident record. Useful for tracking issues, outages, or events in the system.',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createIncidentMiddleware],
  });
};

export default initialiseRoute;
