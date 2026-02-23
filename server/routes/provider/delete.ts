import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteProviderMiddleware from '../../middleware/provider/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/provider/delete',
    summary: 'Delete OAuth provider',
    description: 'Endpoint to handle the deletion of an OAuth provider',
    tags: ['provider'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteProviderMiddleware],
  });
};

export default initialiseRoute;
