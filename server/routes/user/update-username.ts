import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdateUsername from '../../middleware/user/update/username.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/username',
    summary: 'Update username',
    description: 'Update username',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdateUsername],
  });
};

export default initialiseRoute;
