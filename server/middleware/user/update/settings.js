import { updateUserSettings } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const userUpdateSettings = async (request, response) => {
  try {
    const { settings } = request.body;

    if (
      typeof settings !== 'object' ||
      settings === null ||
      Array.isArray(settings)
    ) {
      return response.sendStatus(400);
    }

    await updateUserSettings(response.locals.user.email, settings);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default userUpdateSettings;
