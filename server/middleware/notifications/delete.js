import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { deleteNotification } from '../../database/queries/notification.js';

const NotificationDeleteMiddleware = async (request, response) => {
  try {
    const { notificationId } = request.query;

    if (!notificationId) {
      throw new UnprocessableError('No notificationId provided');
    }

    await deleteNotification(notificationId, response.locals.user.workspaceId);
    return response.status(200).send('Notification deleted');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationDeleteMiddleware;
