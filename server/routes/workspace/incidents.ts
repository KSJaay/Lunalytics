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
    summary: 'Get a list of incidents for the given workspace',
    description: 'Get a list of incidents for the given workspace',
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
