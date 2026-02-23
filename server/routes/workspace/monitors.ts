import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import workspaceMonitorsMiddleware from '../../middleware/workspace/monitors.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/monitors',
    summary: 'Get Workspace Monitors',
    description:
      'Retrieves all monitors for a workspace. Useful for tracking uptime, performance, or service health.',
    tags: ['workspace'],
    security: '0',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      memberHasPermission(MemberPermissionBits.VIEW_MONITORS),
      workspaceMonitorsMiddleware,
    ],
  });
};

export default initialiseRoute;
