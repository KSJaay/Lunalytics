import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import register from '../../middleware/auth/register.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/register',
    summary: 'Register user with given information',
    description: 'Register user with given information',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [register],
  });
};

export default initialiseRoute;
