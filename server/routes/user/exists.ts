import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userExistsMiddleware from '../../middleware/user/exists.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/exists',
    summary: 'User Exists',
    description:
      'Checks if a user exists based on the provided email. Useful for registration, invitations, and validation.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userExistsMiddleware],
  });
};

export default initialiseRoute;
