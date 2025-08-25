import { toast } from 'react-toastify';
import validateStatusSettings from '../../../../shared/validators/status/settings';
import validateStatusLayout from '../../../../shared/validators/status/layout';
import { createPostRequest } from '../../../services/axios';
import {
  ObjectSchemaValidatorError,
  StatusPageValidatorError,
} from '../../../../shared/utils/errors';

interface SettingsProps {
  font: string;
  theme: string;
  headerBackground: string;
  background: string;
  textColor: string;
  highlight: string;
  url: string;
  logo: string;
  title: string;
  homepageUrl: string;
  isPublic: boolean;
  hidePaused: boolean;
}

const handleCreateOrEditStatusPage = async (
  settings: SettingsProps,
  layout: Array<any> = [],
  callback: (data: any) => void,
  isEdit: boolean,
  statusPageId?: string
) => {
  try {
    validateStatusSettings(settings);
    validateStatusLayout(layout);

    const monitors = layout
      .filter((item) => item.type === 'uptime' || item.type === 'metrics')
      .reduce((a, b) => [...a, ...b.monitors], []);

    if (monitors.length === 0) {
      toast.error(
        'Unable to create status page: No monitors found. Please add at least one monitor to uptime graph or uptime metrics.'
      );

      return false;
    }

    const url = isEdit
      ? `/api/status-pages/update`
      : '/api/status-pages/create';

    const query = await createPostRequest(url, {
      statusId: statusPageId,
      settings,
      layout,
    });

    const message = isEdit
      ? 'Status page updated successfully!'
      : 'Status page created successfully!';

    toast.success(message);
    callback(query.data.data);

    return true;
  } catch (error: any) {
    if (
      error instanceof ObjectSchemaValidatorError ||
      error instanceof StatusPageValidatorError
    ) {
      toast.error(error.message);
      return false;
    }

    if (error.response?.data?.message) {
      const message = isEdit
        ? 'Unable to edit status page: '
        : 'Unable to create status page: ';

      toast.error(message + error.response.data.message);

      return false;
    }

    toast.error('Unknown error occured. Please try again.');
    return false;
  }
};

export default handleCreateOrEditStatusPage;
