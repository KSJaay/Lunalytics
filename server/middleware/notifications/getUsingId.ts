// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { fetchNotificationById } from '../../database/queries/notification.js';
import logger from '../../utils/logger.js';

const NotificationGetUsingIdMiddleware = async (
  request: Request,
  response: Response
) => {
  const { notificationId } = request.query;

  try {
    if (!notificationId) {
      throw new Error('No notificationId provided');
    }

    const notification = await fetchNotificationById(
      notificationId as string,
      response.locals.workspaceId
    );

    if (!notification) {
      logger.error('Notification - getById', {
        notificationId,
        message: 'Notification does not exist',
      });

      return response.status(404).send({
        message: 'Notification not found',
      });
    }

    return response.status(200).send(notification);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationGetUsingIdMiddleware;
