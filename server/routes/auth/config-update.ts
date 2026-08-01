import * as zod from 'zod';
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
    summary: 'Update authentication configuration',
    description: 'Endpoint to handle updating authentication configuration',
    tags: ['auth'],
    security: '1',
    deprecated: false,
    validations: {
      headers: zod.object({
        Authorization: zod.string(),
      }),
    },
    responses: [],
    middlewares: [
      authorization,
      userHasPermission(UserPermissionBits.ADMINISTRATOR),
      updateConfigMiddleware,
    ],
  });
};

export default initialiseRoute;
