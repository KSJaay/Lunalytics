import { Router } from 'express';
import { createRoute } from '../../server/utils/createRoute.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: '{{method}}',
    path: '{{path}}',
    summary: '{{summary}}',
    description: '{{description}}',
    tags: ['{{tag}}'],
    security: '{{security}}',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [],
  });
};

export default initialiseRoute;
