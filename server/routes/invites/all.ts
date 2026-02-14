import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import getAllInvitesMiddleware from '../../middleware/invites/getAll.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/invites/all',
    summary: 'Get all invites for the given workspace',
    description: 'Get all invites for the given workspace',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [getAllInvitesMiddleware],
  });
};

export default initialiseRoute;
