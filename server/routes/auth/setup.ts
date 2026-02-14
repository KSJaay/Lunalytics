import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { setup } from '../../middleware/auth/index.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/setup',
    summary: 'Setup initial Lunalytics settings',
    description: 'Setup initial Lunalytics settings',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [setup],
  });
};

export default initialiseRoute;
