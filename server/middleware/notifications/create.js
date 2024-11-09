import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import { userExists } from '../../database/queries/user.js';
import cache from '../../cache/index.js';

const NotificationCreateMiddleware = async (request, response) => {
  const notification = request.body;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification, ...notification.data });

    const user = await userExists(request.cookies.access_token);

    const query = await cache.notifications.create(result, user.email);

    return response.status(201).send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationCreateMiddleware;
