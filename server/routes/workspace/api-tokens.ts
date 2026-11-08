import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import workspaceApiTokensMiddleware from '../../middleware/workspace/api_tokens.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/api-tokens',
    summary: 'Get Workspace API Tokens',
    description:
      'Retrieves all API tokens for a workspace. Useful for integration, automation, and access control.',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      memberHasPermission(MemberPermissionBits.ADMINISTRATOR),
      workspaceApiTokensMiddleware,
    ],
  });
};

export default initialiseRoute;
