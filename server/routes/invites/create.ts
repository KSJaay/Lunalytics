import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createInviteMiddleware from '../../middleware/invites/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/invites/create',
    summary: 'Create a new invite for the given workspace',
    description: 'Create a new invite for the given workspace',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createInviteMiddleware],
  });
};

export default initialiseRoute;
