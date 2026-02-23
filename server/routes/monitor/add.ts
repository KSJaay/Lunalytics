import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import monitorAdd from '../../middleware/monitor/add.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/monitor/add',
    summary: 'Add Monitor',
    description:
      'Adds a new monitor to a workspace. Useful for tracking uptime, performance, or service health.',
    tags: ['monitor'],
    security: '6',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_MONITORS),
      monitorAdd,
    ],
  });
};

export default initialiseRoute;
