import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import pauseInviteMiddleware from '../../middleware/invites/pause.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/invites/pause',
    summary: 'Pause Invite',
    description:
      'Pauses an invite for a workspace. Useful for temporarily disabling access without deleting the invitation.',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [pauseInviteMiddleware],
  });
};

export default initialiseRoute;
