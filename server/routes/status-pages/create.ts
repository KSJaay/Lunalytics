import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import createStatusPageMiddleware from '../../middleware/status/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/status-pages/create',
    summary: 'Create Status Page',
    description:
      'Creates a new status page. Useful for public communication of system health, incidents, or maintenance.',
    tags: ['status-pages'],
    security: '96',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_STATUS_PAGES),
      createStatusPageMiddleware,
    ],
  });
};

export default initialiseRoute;
