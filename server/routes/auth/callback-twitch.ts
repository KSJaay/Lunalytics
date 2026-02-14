import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';
import twitchCallback from '../../middleware/auth/callback/twitch.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/twitch',
    summary: 'Endpoint to verify users connecting using Twitch',
    description: 'Endpoint to verify users connecting using Twitch',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [twitchCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
