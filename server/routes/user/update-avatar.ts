import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import userUpdateAvatar from '../../middleware/user/update/avatar.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/update/avatar',
    summary: 'Update Avatar',
    description:
      'Allows users to update their profile avatar image. Useful for personalization and user identity.',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [userUpdateAvatar],
  });
};

export default initialiseRoute;
