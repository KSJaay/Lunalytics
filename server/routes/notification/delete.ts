import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import NotificationDeleteMiddleware from '../../middleware/notifications/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/notification/delete',
    summary: 'Delete Notification',
    description:
      'Deletes a notification. Useful for removing outdated or irrelevant alerts from the system.',
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
