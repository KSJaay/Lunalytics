import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createApiTokenMiddleware from '../../middleware/tokens/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/tokens/create',
    summary: 'Create token',
    description: 'Handle creation of a new API token',
    tags: ['tokens'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createApiTokenMiddleware],
  });
};

export default initialiseRoute;
