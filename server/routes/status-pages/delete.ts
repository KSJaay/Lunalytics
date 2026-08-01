import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import deleteStatusPageMiddleware from '../../middleware/status/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/status-pages/delete',
    summary: 'Delete Status Page',
    description:
      'Deletes a status page by ID. Useful for removing outdated or unnecessary public pages.',
    tags: ['status-pages'],
    security: '96',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      memberHasPermission(MemberPermissionBits.MANAGE_STATUS_PAGES),
      deleteStatusPageMiddleware,
    ],
  });
};

export default initialiseRoute;
