import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import customCallback from '../../middleware/auth/callback/custom.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/custom',
    summary: 'Custom OAuth callback',
    description: 'Endpoint to handle custom OAuth provider callback',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [customCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
