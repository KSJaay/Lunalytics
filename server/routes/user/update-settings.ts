import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdateSettings from '../../middleware/user/update/settings.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/settings',
    summary: 'Update user preference settings',
    description: 'Update user preference settings',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdateSettings],
  });
};

export default initialiseRoute;
