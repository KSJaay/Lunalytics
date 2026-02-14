import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createIncidentMessageMiddleware from '../../middleware/incident/addMessage.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/messages/create',
    summary: 'Create a new incident message',
    description: 'Create a new incident message',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createIncidentMessageMiddleware],
  });
};

export default initialiseRoute;
