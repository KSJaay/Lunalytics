import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getUsingIdMiddleware from '../../middleware/status/getUsingId.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/status-pages/id',
    summary: 'Get information about a status page using an ID',
    description: 'Get information about a status page using an ID',
    tags: ['status-pages'],
    security: '32',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getUsingIdMiddleware],
  });
};

export default initialiseRoute;
