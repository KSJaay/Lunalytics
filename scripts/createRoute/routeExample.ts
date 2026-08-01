import { Router } from 'express';
import { createRoute } from '../../server/utils/createRoute.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    // @ts-ignore
    method: '{{method}}',
    // @ts-ignore
    path: '{{path}}',
    // @ts-ignore
    summary: '{{summary}}',
    // @ts-ignore
    description: '{{description}}',
    // @ts-ignore
    tags: ['{{tag}}'],
    // @ts-ignore
    security: '{{security}}',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [],
  });
};

export default initialiseRoute;
