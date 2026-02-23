import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdateSettings from '../../middleware/user/update/settings.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/settings',
    summary: 'Update Settings',
    description:
      'Allows users to update their account preferences and settings. Useful for customizing user experience.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdateSettings],
  });
};

export default initialiseRoute;
