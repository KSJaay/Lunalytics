import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import accessDeclineMiddleware from '../../middleware/user/access/declineUser.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/access/decline',
    summary: 'Decline user access to application',
    description: 'Decline user access to application',
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
