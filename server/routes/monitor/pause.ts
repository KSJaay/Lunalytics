import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import monitorPause from '../../middleware/monitor/pause.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/monitor/pause',
    summary: 'Pause Monitor',
    description:
      'Pauses monitoring checks for a workspace. Useful for maintenance windows or troubleshooting.',
    tags: ['monitor'],
    security: '6',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_MONITORS),
      monitorPause,
    ],
  });
};

export default initialiseRoute;
