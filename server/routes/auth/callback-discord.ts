import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import discordCallback from '../../middleware/auth/callback/discord.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/discord',
    summary: 'Discord OAuth callback',
    description: 'Endpoint to handle Discord OAuth provider callback',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [discordCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
