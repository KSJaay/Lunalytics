import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import NotificationEditMiddleware from '../../middleware/notifications/edit.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/notification/edit',
    summary: 'Edit a notification',
    description: 'Edit a notification',
    tags: ['notification'],
    security: '24',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_NOTIFICATIONS),
      NotificationEditMiddleware,
    ],
  });
};

export default initialiseRoute;
