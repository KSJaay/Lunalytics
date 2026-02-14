import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import fetchMonitorUsingId from '../../middleware/monitor/id.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/monitor/id',
    summary: 'Get information about a specific monitor',
    description: 'Get information about a specific monitor',
    tags: ['monitor'],
    security: '2',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [fetchMonitorUsingId],
  });
};

export default initialiseRoute;
