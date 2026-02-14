import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import githubCallback from '../../middleware/auth/callback/github.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/github',
    summary: 'Endpoint to verify users connecting using GitHub',
    description: 'Endpoint to verify users connecting using GitHub',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [githubCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
