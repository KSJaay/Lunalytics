import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getAllConnectionMiddleware from '../../middleware/user/connections/getAll.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/user/connections',
    summary: 'Get Connections',
    description:
      'Fetches the current user’s connection status and details. Useful for monitoring linked accounts or integrations.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getAllConnectionMiddleware],
  });
};

export default initialiseRoute;
