import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteIncidentMessageMiddleware from '../../middleware/incident/deleteMessage.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/messages/delete',
    summary: 'Delete Incident Message',
    description:
      'Deletes a message from an incident. Useful for removing outdated or incorrect communications.',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteIncidentMessageMiddleware],
  });
};

export default initialiseRoute;
