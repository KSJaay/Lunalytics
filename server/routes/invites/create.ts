import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import createInviteMiddleware from '../../middleware/invites/create.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/invites/create',
    summary: 'Create Invite',
    description:
      'Creates a new invite for a workspace. Useful for onboarding new members or collaborators.',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [createInviteMiddleware],
  });
};

export default initialiseRoute;
