// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';
import { deleteNotification } from '../../database/queries/notification.js';

const NotificationDeleteMiddleware = async (
  request: Request,
  response: Response
) => {
  try {
    const { notificationId } = request.query;

    if (!notificationId) {
      return response.status(400).json(NOTIFICATION_ERRORS.N001);
    }

    await deleteNotification(
      notificationId as string,
      response.locals.workspaceId
    );
    return response.status(200).send('Notification deleted');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationDeleteMiddleware;
