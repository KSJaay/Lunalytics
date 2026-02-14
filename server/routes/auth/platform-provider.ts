import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import redirectUsingProviderMiddleware from '../../middleware/auth/platform.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/platform/:provider',
    summary: 'Redirect user to the oauth platform selected',
    description: 'Redirect user to the oauth platform selected',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [redirectUsingProviderMiddleware],
  });
};

export default initialiseRoute;
