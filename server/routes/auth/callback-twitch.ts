import * as zod from 'zod';
import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';
import twitchCallback from '../../middleware/auth/callback/twitch.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/twitch',
    summary: 'Twitch OAuth callback',
    description: 'Endpoint to handle Twitch OAuth provider callback',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {
      query: zod.object({
        code: zod.string(),
        invite: zod.string().optional(),
      }),
    },
    responses: [],
    middlewares: [twitchCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
