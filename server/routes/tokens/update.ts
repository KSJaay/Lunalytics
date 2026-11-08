import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import updateApiTokenMiddleware from '../../middleware/tokens/update.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/tokens/update',
    summary: 'Update token',
    description: 'Handle updating of an API token',
    tags: ['tokens'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [updateApiTokenMiddleware],
  });
};

export default initialiseRoute;
