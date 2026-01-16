import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';
import { toggleNotification } from '../../database/queries/notification.js';

const NotificationToggleMiddleware = async (request, response) => {
  const { notificationId, isEnabled } = request.query;

  try {
    if (!notificationId) {
      return response.status(400).json(NOTIFICATION_ERRORS.N001);
    }

    if (isEnabled !== 'true' && isEnabled !== 'false') {
      return response
        .status(400)
        .json({
          ...NOTIFICATION_ERRORS.N003,
          details: 'isEnabled is not a boolean',
        });
    }

    await toggleNotification(
      notificationId,
      response.locals.workspaceId,
      isEnabled === 'true'
    );
    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationToggleMiddleware;
