import * as zod from 'zod';
import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getConfigMiddleware from '../../middleware/auth/config/getConfig.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/config',
    summary: 'Retrieve authentication configuration',
    description: 'Endpoint for retrieving authentication configuration',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getConfigMiddleware],
  });
};

export default initialiseRoute;
