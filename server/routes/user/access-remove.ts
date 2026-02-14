import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import accessRemoveMiddleware from '../../middleware/user/access/removeUser.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/access/remove',
    summary: 'Remove a user from the application',
    description: 'Remove a user from the application',
    tags: ['user'],
    security: '512',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      userHasPermission(UserPermissionBits.MANAGE_TEAM),
      accessRemoveMiddleware,
    ],
  });
};

export default initialiseRoute;
