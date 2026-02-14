import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import NotificationGetUsingIdMiddleware from '../../middleware/notifications/getUsingId.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/notification/id',
    summary: 'Get information about a specific notification using id',
    description: 'Get information about a specific notification using id',
    tags: ['notification'],
    security: '8',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [NotificationGetUsingIdMiddleware],
  });
};

export default initialiseRoute;
