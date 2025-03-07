import {
  ObjectSchemaValidatorError,
  StatusPageValidatorError,
} from '../../../shared/utils/errors.js';
import { handleError } from '../../utils/errors.js';
import { userExists } from '../../database/queries/user.js';
import { createStatusPage } from '../../database/queries/status.js';
import validateStatusLayout from '../../../shared/validators/status/layout.js';
import validateStatusSettings from '../../../shared/validators/status/settings.js';
import { cleanStatusPage } from '../../class/status.js';
import statusCache from '../../cache/status.js';

const createStatusPageMiddleware = async (request, response) => {
  const { settings, layout } = request.body;

  try {
    validateStatusSettings(settings);
    validateStatusLayout(layout);

    const monitors = layout
      .filter((item) => item.type === 'uptime' || item.type === 'metrics')
      .reduce((a, b) => [...a, ...b.monitors], []);

    if (monitors.length === 0) {
      throw new StatusPageValidatorError(
        'No monitors found. Please add at least one monitor to uptime graph or uptime metrics.'
      );
    }

    const { access_token } = request.cookies;
    const user = await userExists(access_token);

    const query = await createStatusPage(settings, layout, user);

    await statusCache.addNewStatusPage(cleanStatusPage(query));

    response.status(200).send({
      message: 'Status page created successfully!',
      data: cleanStatusPage(query),
    });
  } catch (error) {
    if (!response.headersSent) {
      if (
        error instanceof ObjectSchemaValidatorError ||
        error instanceof StatusPageValidatorError
      ) {
        response.status(400).send({
          message: error.message,
        });
      }
    }

    handleError(error, response);
  }
};

export default createStatusPageMiddleware;
