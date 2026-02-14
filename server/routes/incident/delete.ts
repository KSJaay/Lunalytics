import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteIncidentMiddleware from '../../middleware/incident/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/delete',
    summary: 'Delete an existing incident',
    description: 'Deletes an incident based on the provided incident ID.',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteIncidentMiddleware],
  });
};

export default initialiseRoute;
