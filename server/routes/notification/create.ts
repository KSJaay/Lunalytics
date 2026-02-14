import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import NotificationCreateMiddleware from '../../middleware/notifications/create.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/notification/create',
    summary: 'Create a new notification',
    description: 'Create a new notification',
    tags: ['notification'],
    security: '24',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_NOTIFICATIONS),
      NotificationCreateMiddleware,
    ],
  });
};

export default initialiseRoute;
