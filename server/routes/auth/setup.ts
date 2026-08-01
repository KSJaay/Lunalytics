// import * as zod from 'zod';
import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { setup } from '../../middleware/auth/index.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'post',
    path: '/api/auth/setup',
    summary: 'Setup Lunalytics',
    description: 'Endpoint to handle initial Lunalytics setup',
    tags: ['auth'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [setup],
  });
};

export default initialiseRoute;
