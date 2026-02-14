import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import fetchUserMiddleware from '../../middleware/user/user.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/user',
    summary: 'Get current user',
    description: 'Get the current session user',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [fetchUserMiddleware],
  });
};

export default initialiseRoute;
