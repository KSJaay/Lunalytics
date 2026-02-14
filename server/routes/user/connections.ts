import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getAllConnectionMiddleware from '../../middleware/user/connections/getAll.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/user/connections',
    summary: 'Get the users current connection status',
    description: 'Get the users current connection status',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getAllConnectionMiddleware],
  });
};

export default initialiseRoute;
