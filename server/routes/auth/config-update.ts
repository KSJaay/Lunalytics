import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import authorization from '../../middleware/authorization.js';
import { userHasPermission } from '../../middleware/hasPermission.js';
import { UserPermissionBits } from '../../../shared/permissions/bitFlags.js';
import updateConfigMiddleware from '../../middleware/auth/config/update.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/config/update',
    summary: 'Endpoint to update authentication configuration',
    description: 'Endpoint to update authentication configuration',
    tags: ['auth'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorization,
      userHasPermission(UserPermissionBits.ADMINISTRATOR),
      updateConfigMiddleware,
    ],
  });
};

export default initialiseRoute;
