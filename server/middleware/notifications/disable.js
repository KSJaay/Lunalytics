import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { toggleNotification } from '../../database/queries/notification.js';

const NotificationToggleMiddleware = async (request, response) => {
  const { notificationId, isEnabled } = request.query;

  try {
    if (!notificationId) {
      throw new UnprocessableError('No notificationId provided');
    }

    if (isEnabled !== 'true' && isEnabled !== 'false') {
      throw new UnprocessableError('isEnabled is not a boolean');
    }

    await toggleNotification(notificationId, isEnabled === 'true');
    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationToggleMiddleware;
