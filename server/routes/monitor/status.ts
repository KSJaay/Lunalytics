import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import fetchMonitorStatus from '../../middleware/monitor/status.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/monitor/status',
    summary: 'Monitor Status',
    description:
      'Retrieves the status of a specific monitor. Useful for checking uptime, performance, or alerts.',
    tags: ['monitor'],
    security: '0',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [fetchMonitorStatus],
  });
};

export default initialiseRoute;
