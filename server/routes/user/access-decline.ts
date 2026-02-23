import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import accessDeclineMiddleware from '../../middleware/user/access/declineUser.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/access/decline',
    summary: 'Decline Access',
    description:
      'Allows admins to decline user access requests, preventing them from joining the application. Useful for controlling who can become a member.',
    tags: ['user'],
    security: '512',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      userHasPermission(UserPermissionBits.MANAGE_TEAM),
      accessDeclineMiddleware,
    ],
  });
};

export default initialiseRoute;
