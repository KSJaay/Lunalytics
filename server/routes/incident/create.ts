import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createIncidentMiddleware from '../../middleware/incident/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/create',
    summary: 'Create a new incident',
    description: 'Create a new incident',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createIncidentMiddleware],
  });
};

export default initialiseRoute;
