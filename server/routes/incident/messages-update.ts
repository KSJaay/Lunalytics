import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import updateIncidentMessageMiddleware from '../../middleware/incident/updateMessage.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/incident/messages/update',
    summary: 'Update Incident Message',
    description:
      'Updates an existing message for an incident. Useful for correcting or clarifying communication during incident resolution.',
    tags: ['incident'],
    security: '256',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [updateIncidentMessageMiddleware],
  });
};

export default initialiseRoute;
