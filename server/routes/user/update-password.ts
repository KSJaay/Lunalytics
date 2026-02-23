import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdatePassword from '../../middleware/user/update/password.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/password',
    summary: 'Update Password',
    description:
      'Allows users to change their account password. Useful for security and password management.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdatePassword],
  });
};

export default initialiseRoute;
