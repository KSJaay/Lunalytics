import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import fetchUserMiddleware from '../../middleware/user/user.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/user',
    summary: 'Get User',
    description:
      'Fetches the current session user details. Useful for authentication and user profile display.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [fetchUserMiddleware],
  });
};

export default initialiseRoute;
