import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdateUsername from '../../middleware/user/update/username.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/username',
    summary: 'Update Username',
    description:
      'Allows users to change their username. Useful for personalization and user identity.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdateUsername],
  });
};

export default initialiseRoute;
