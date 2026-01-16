import { handleError } from '../../utils/errors.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { deleteNotification } from '../../database/queries/notification.js';

const NotificationDeleteMiddleware = async (request, response) => {
  try {
    const { notificationId } = request.query;

    if (!notificationId) {
      return response.status(400).json(NOTIFICATION_ERRORS.N001);
    }

    await deleteNotification(notificationId, response.locals.workspaceId);
    return response.status(200).send('Notification deleted');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationDeleteMiddleware;
