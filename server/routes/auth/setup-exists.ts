import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import setupExistsMiddleware from '../../middleware/setupExists.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/auth/setup/exists',
    summary: 'Check if setup exists',
    description: 'Endpoint to check if Lunalytics has already been setup',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [setupExistsMiddleware],
  });
};

export default initialiseRoute;
