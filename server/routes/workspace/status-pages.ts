import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getAllStatusPagesMiddleware from '../../middleware/workspace/status-pages.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/status-pages',
    summary: 'Get a list of status pages for the given workspace',
    description: 'Get a list of status pages for the given workspace',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      memberHasPermission(MemberPermissionBits.VIEW_STATUS_PAGES),
      getAllStatusPagesMiddleware,
    ],
  });
};

export default initialiseRoute;
