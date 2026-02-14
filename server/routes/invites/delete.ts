import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import deleteInviteMiddleware from '../../middleware/invites/delete.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/invites/delete',
    summary: 'Delete an invite for the given workspace',
    description: 'Delete an invite for the given workspace',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [deleteInviteMiddleware],
  });
};

export default initialiseRoute;
