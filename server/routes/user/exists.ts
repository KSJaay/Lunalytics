import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userExistsMiddleware from '../../middleware/user/exists.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/exists',
    summary: 'Check if user with given email exists',
    description: 'Check if user with given email exists',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userExistsMiddleware],
  });
};

export default initialiseRoute;
