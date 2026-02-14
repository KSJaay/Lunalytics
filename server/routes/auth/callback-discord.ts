import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import discordCallback from '../../middleware/auth/callback/discord.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/discord',
    summary: 'Endpoint to verify users connecting using Discord',
    description: 'Endpoint to verify users connecting using Discord',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [discordCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
