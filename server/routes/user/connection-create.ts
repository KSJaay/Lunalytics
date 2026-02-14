import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createConnectionMiddleware from '../../middleware/user/connections/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/connection/create',
    summary: 'Create a new connection for a user',
    description: 'Create a new connection for a user',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createConnectionMiddleware],
  });
};

export default initialiseRoute;
