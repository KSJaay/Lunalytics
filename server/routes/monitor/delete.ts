import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import monitorDelete from '../../middleware/monitor/delete.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/monitor/delete',
    summary: 'Delete Monitor',
    description:
      'Deletes a monitor from a workspace. Useful for removing unused or obsolete monitoring checks.',
    tags: ['monitor'],
    security: '6',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_MONITORS),
      monitorDelete,
    ],
  });
};

export default initialiseRoute;
