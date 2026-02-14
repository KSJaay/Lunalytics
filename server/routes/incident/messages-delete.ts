import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteIncidentMessageMiddleware from '../../middleware/incident/deleteMessage.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/messages/delete',
    summary: 'Delete an existing incident message',
    description: 'Delete an existing incident message',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteIncidentMessageMiddleware],
  });
};

export default initialiseRoute;
