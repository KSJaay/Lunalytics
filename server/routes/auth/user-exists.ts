// import * as zod from 'zod';
import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import emailExistsMiddleware from '../../middleware/auth/emailExists.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/user/exists',
    summary: 'User exists',
    description: 'Endpoint to check if the user exists',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [emailExistsMiddleware],
  });
};

export default initialiseRoute;
