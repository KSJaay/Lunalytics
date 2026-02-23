import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import accessApproveMiddleware from '../../middleware/user/access/approveUser.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/access/approve',
    summary: 'Approve Access',
    description:
      'Allows admins to approve user access requests, granting permissions to join the application. Useful for onboarding and managing team membership.',
    tags: ['user'],
    security: '512',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      userHasPermission(UserPermissionBits.MANAGE_TEAM),
      accessApproveMiddleware,
    ],
  });
};

export default initialiseRoute;
