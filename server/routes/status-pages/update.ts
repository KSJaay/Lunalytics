import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import editStatusPageMiddleware from '../../middleware/status/edit.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/status-pages/update',
    summary: 'Update information for status page',
    description: 'Update information for status page',
    tags: ['status-pages'],
    security: '96',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_STATUS_PAGES),
      editStatusPageMiddleware,
    ],
  });
};

export default initialiseRoute;
