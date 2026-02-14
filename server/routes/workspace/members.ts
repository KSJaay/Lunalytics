import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import workspaceMembersMiddleware from '../../middleware/workspace/members.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/members',
    summary: 'Get a list of members for the given workspace',
    description: 'Get a list of members for the given workspace',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [authorizeWorkspace, workspaceMembersMiddleware],
  });
};

export default initialiseRoute;
