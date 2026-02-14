import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import logout from '../../middleware/auth/logout.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/logout',
    summary: 'Logout the current user',
    description: 'Logout the current user',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [logout],
  });
};

export default initialiseRoute;
