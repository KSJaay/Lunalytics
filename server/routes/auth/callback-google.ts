import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import googleCallback from '../../middleware/auth/callback/google.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/google',
    summary: 'Endpoint to verify users connecting using Google',
    description: 'Endpoint to verify users connecting using Google',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [googleCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
