import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteConnectionMiddleware from '../../middleware/user/connections/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/connection/delete',
    summary: 'Delete Connection',
    description:
      'Allows users to remove a connection to external services or accounts. Useful for managing integrations and privacy.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteConnectionMiddleware],
  });
};

export default initialiseRoute;
