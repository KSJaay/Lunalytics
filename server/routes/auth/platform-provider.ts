import * as zod from 'zod';
import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import redirectUsingProviderMiddleware from '../../middleware/auth/platform.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/platform/:provider',
    summary: 'Redirect to OAuth provider',
    description:
      'Endpoint to handle redirection to the selected OAuth provider',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [redirectUsingProviderMiddleware],
  });
};

export default initialiseRoute;
