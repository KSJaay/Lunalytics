import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createWorkspaceMiddleware from '../../middleware/workspace/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/workspace/create',
    summary: 'Create a new workspace',
    description: 'Create a new workspace',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createWorkspaceMiddleware],
  });
};

export default initialiseRoute;
