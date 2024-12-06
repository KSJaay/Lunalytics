import { handleError } from '../../utils/errors.js';
import { fetchNotificationById } from '../../database/queries/notification.js';
import logger from '../../utils/logger.js';

const NotificationGetUsingIdMiddleware = async (request, response) => {
  const { notificationId } = request.query;

  try {
    const notification = await fetchNotificationById(notificationId);

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
