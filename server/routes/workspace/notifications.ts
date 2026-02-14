import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import workspaceNotificationsMiddleware from '../../middleware/workspace/notifications.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/notifications',
    summary: 'Get a list of notifications for the given workspace',
    description: 'Get a list of notifications for the given workspace',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      memberHasPermission(MemberPermissionBits.VIEW_NOTIFICATIONS),
      workspaceNotificationsMiddleware,
    ],
  });
};

export default initialiseRoute;
