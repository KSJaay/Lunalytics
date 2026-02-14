import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import updateIncidentMiddleware from '../../middleware/incident/update.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/update',
    summary: 'Update an existing incident',
    description: 'Update an existing incident',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [updateIncidentMiddleware],
  });
};

export default initialiseRoute;
