import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteApiTokenMiddleware from '../../middleware/tokens/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/tokens/delete',
    summary: 'Delete token',
    description: 'Handle deletion of an API token',
    tags: ['tokens'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteApiTokenMiddleware],
  });
};

export default initialiseRoute;
