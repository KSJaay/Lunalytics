import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createConnectionMiddleware from '../../middleware/user/connections/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/connection/create',
    summary: 'Create Connection',
    description:
      'Allows users to create a new connection to external services or accounts. Useful for integrations and expanding functionality.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createConnectionMiddleware],
  });
};

export default initialiseRoute;
