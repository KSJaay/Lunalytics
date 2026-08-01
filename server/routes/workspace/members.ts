import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import workspaceMembersMiddleware from '../../middleware/workspace/members.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/members',
    summary: 'Get Workspace Members',
    description:
      'Retrieves all members of a workspace. Useful for team management and collaboration.',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [authorizeWorkspace, workspaceMembersMiddleware],
  });
};

export default initialiseRoute;
