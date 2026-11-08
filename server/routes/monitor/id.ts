import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import fetchMonitorUsingId from '../../middleware/monitor/id.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/monitor/id',
    summary: 'Get Monitor By ID',
    description:
      'Retrieves a monitor by its ID. Useful for viewing details and status of a specific monitoring check.',
    tags: ['monitor'],
    security: '2',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [fetchMonitorUsingId],
  });
};

export default initialiseRoute;
