import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import permissionUpdateMiddleware from '../../middleware/user/permission/update.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/permission/update',
    summary: 'Update Permissions',
    description:
      'Allows administrators to modify user permissions, granting or restricting access to features. Useful for managing roles and security.',
    tags: ['user'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      userHasPermission(UserPermissionBits.ADMINISTRATOR),
      permissionUpdateMiddleware,
    ],
  });
};

export default initialiseRoute;
