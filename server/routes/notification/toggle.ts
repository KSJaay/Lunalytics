import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import NotificationToggleMiddleware from '../../middleware/notifications/disable.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/notification/toggle',
    summary: 'Enable/disable notification',
    description: 'Enable/disable notification',
    tags: ['notification'],
    security: '24',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_NOTIFICATIONS),
      NotificationToggleMiddleware,
    ],
  });
};

export default initialiseRoute;
