import {
  ObjectSchemaValidatorError,
  StatusPageValidatorError,
} from '../../../shared/utils/errors.js';
import { handleError } from '../../utils/errors.js';
import { updateStatusPage } from '../../database/queries/status.js';
import validateStatusLayout from '../../../shared/validators/status/layout.js';
import validateStatusSettings from '../../../shared/validators/status/settings.js';
import { cleanStatusPage } from '../../class/status.js';
import statusCache from '../../cache/status.js';

const editStatusPageMiddleware = async (request, response) => {
  const { statusId, settings, layout } = request.body;

  try {
    validateStatusSettings(settings);
    validateStatusLayout(layout);

    if (!statusId) {
      throw new StatusPageValidatorError('Status page id is required.');
    }

    const monitors = layout
      .filter((item) => item.type === 'uptime' || item.type === 'metrics')
      .reduce((a, b) => [...a, ...b.monitors], []);

    if (monitors.length === 0) {
      throw new StatusPageValidatorError(
        'No monitors found. Please add at least one monitor to uptime graph or uptime metrics.'
      );
    }

    const { user } = response.locals;

    const query = await updateStatusPage(
      response.locals.workspaceId,
      statusId,
      settings,
      layout,
      user
    );

    const statusPage = cleanStatusPage(query);

    await statusCache.updateStatusPage(statusPage);

    response.status(200).send({
      message: 'Status page created successfully!',
      data: statusPage,
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

export default editStatusPageMiddleware;
