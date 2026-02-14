import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import configureProviderMiddleware from '../../middleware/provider/configure.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/provider/configure',
    summary: 'Configure settings for OAuth providers',
    description: 'Configure settings for OAuth providers',
    tags: ['provider'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [configureProviderMiddleware],
  });
};

export default initialiseRoute;
