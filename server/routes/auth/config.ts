import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getConfigMiddleware from '../../middleware/auth/config/getConfig.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/config',
    summary: 'Endpoint to retrieve authentication configuration',
    description: 'Endpoint to retrieve authentication configuration',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getConfigMiddleware],
  });
};

export default initialiseRoute;
