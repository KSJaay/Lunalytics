import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import login from '../../middleware/auth/login.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/login',
    summary: 'Login user credentials',
    description: 'Login user credentials',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [login],
  });
};

export default initialiseRoute;
