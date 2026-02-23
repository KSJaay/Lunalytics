import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import slackCallback from '../../middleware/auth/callback/slack.js';
import signInOrRegisterUsingAuth from '../../middleware/auth/signInOrRegisterUsingAuth.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/callback/slack',
    summary: 'Slack OAuth callback',
    description: 'Endpoint to handle Slack OAuth provider callback',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [slackCallback, signInOrRegisterUsingAuth],
  });
};

export default initialiseRoute;
