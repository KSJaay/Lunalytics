import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import NotificationGetUsingIdMiddleware from '../../middleware/notifications/getUsingId.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/notification/id',
    summary: 'Get Notification By ID',
    description:
      'Retrieves a notification by its ID. Useful for viewing specific alert details.',
    tags: ['notification'],
    security: '8',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [NotificationGetUsingIdMiddleware],
  });
};

export default initialiseRoute;
