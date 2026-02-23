import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/status/',
    summary: 'Find status page',
    description: 'Find information about a status page',
    tags: ['status'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [],
  });
};

export default initialiseRoute;
