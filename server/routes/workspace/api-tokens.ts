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
    summary: 'Get a list of API Tokens for the given workspace',
    description: 'Get a list of API Tokens for the given workspace',
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
