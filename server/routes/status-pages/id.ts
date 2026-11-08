import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getUsingIdMiddleware from '../../middleware/status/getUsingId.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/status-pages/id',
    summary: 'Get Status Page By ID',
    description:
      'Retrieves a status page by its ID. Useful for viewing details and history of a specific public page.',
    tags: ['status-pages'],
    security: '32',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getUsingIdMiddleware],
  });
};

export default initialiseRoute;
