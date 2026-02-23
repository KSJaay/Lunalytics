import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import getAllIncidents from '../../middleware/incident/getAll.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/incidents',
    summary: 'Get Workspace Incidents',
    description:
      'Retrieves all incidents for a workspace. Useful for monitoring issues, outages, or events.',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      memberHasPermission(MemberPermissionBits.VIEW_INCIDENTS),
      getAllIncidents,
    ],
  });
};

export default initialiseRoute;
