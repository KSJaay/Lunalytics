import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import NotificationDeleteMiddleware from '../../middleware/notifications/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/notification/delete',
    summary: 'Delete a notification',
    description: 'Delete a notification',
    tags: ['notification'],
    security: '24',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_NOTIFICATIONS),
      NotificationDeleteMiddleware,
    ],
  });
};

export default initialiseRoute;
