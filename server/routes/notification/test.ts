import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import NotificationTestMiddleware from '../../middleware/notifications/test.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/notification/test',
    summary: 'Test Notification',
    description:
      'Tests a notification to ensure it works correctly. Useful for verifying alert delivery and configuration.',
    tags: ['notification'],
    security: '24',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_NOTIFICATIONS),
      NotificationTestMiddleware,
    ],
  });
};

export default initialiseRoute;
