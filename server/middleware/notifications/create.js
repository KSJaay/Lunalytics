import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import { createNotification } from '../../database/queries/notification.js';
import randomId from '../../utils/randomId.js';

const NotificationCreateMiddleware = async (request, response) => {
  const notification = request.body;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification, ...notification.data });

    const { user, workspaceId } = response.locals;

    const uniqueId = randomId();
    const query = await createNotification({
      ...result,
      workspaceId: workspaceId,
      email: user.email,
      id: uniqueId,
      isEnabled: true,
      created_at: new Date().toISOString(),
    });

    return response.status(201).send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationCreateMiddleware;
