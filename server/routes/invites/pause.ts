import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import pauseInviteMiddleware from '../../middleware/invites/pause.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/invites/pause',
    summary: 'Pause an invite for the given workspace',
    description: 'Pause an invite for the given workspace',
    tags: ['invites'],
    security: '1024',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [pauseInviteMiddleware],
  });
};

export default initialiseRoute;
