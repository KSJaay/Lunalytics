import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import monitorEdit from '../../middleware/monitor/edit.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/monitor/edit',
    summary: 'Edit monitor for workspace',
    description: 'Edit monitor for workspace',
    tags: ['monitor'],
    security: '6',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_MONITORS),
      monitorEdit,
    ],
  });
};

export default initialiseRoute;
