import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteIncidentMiddleware from '../../middleware/incident/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/delete',
    summary: 'Delete Incident',
    description:
      'Deletes an incident by ID. Useful for removing resolved or irrelevant incidents from the system.',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteIncidentMiddleware],
  });
};

export default initialiseRoute;
