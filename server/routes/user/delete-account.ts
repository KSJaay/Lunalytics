import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteAccountMiddleware from '../../middleware/user/deleteAccount.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/delete/account',
    summary: 'Delete Account',
    description:
      'Allows users to permanently delete their account and all associated data. Useful for privacy and user autonomy.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteAccountMiddleware],
  });
};

export default initialiseRoute;
