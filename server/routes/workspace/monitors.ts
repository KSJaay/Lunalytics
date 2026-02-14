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
    summary: 'Get a list of monitors for the given workspace',
    description: 'Get a list of monitors for the given workspace',
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
