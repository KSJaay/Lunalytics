import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getAllProvidersMiddleware from '../../middleware/provider/getAll.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/provider',
    summary: 'Get providers',
    description: 'Endpoint to handle the retrieval of all current providers',
    tags: ['provider'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getAllProvidersMiddleware],
  });
};

export default initialiseRoute;
