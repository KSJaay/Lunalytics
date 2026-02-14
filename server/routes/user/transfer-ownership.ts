import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import transferOwnershipMiddleware from '../../middleware/user/transferOwnership.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/user/transfer/ownership',
    summary: 'Transfer ownership to another user',
    description: 'Transfer ownership to another user',
    tags: ['user'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      userHasPermission(UserPermissionBits.ADMINISTRATOR),
      transferOwnershipMiddleware,
    ],
  });
};

export default initialiseRoute;
