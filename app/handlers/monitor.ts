// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import type { MonitorProps } from '../types/monitor';

const parseJson = (str: string | object | undefined) => {
  try {
    if (typeof str === 'string') {
      return JSON.parse(str);
    }
    if (typeof str === 'object') {
      if (Array.isArray(str)) return {};
      return str;
    }

    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const handleMonitor = async (
  form: Partial<MonitorProps>,
  isEdit: boolean,
  closeModal: () => void,
  setMonitor: (monitor: any) => void
) => {
  try {
    const apiPath = isEdit ? '/api/monitor/edit' : '/api/monitor/add';

    const {
      name,
      parentId,
      type,
      url,
      method,
      port,
      valid_status_codes,
      interval,
      retry,
      retryInterval,
      requestTimeout,
      monitorId,
      notificationId,
      notificationType,
      headers,
      body,
      ignoreTls,
      json_query,
      icon,
    } = form;

    const parsedHeaders = parseJson(headers);
    const parsedBody = parseJson(body);

    const query = await createPostRequest(apiPath, {
      name,
      parentId,
      type,
      url,
      method,
      port,
      valid_status_codes,
      interval,
      retry,
      retryInterval,
      requestTimeout,
      monitorId,
      notificationId,
      notificationType,
      ignoreTls,
      headers: parsedHeaders,
      body: parsedBody,
      json_query,
      icon,
    });

    setMonitor(query.data);

    toast.success(`Monitor been ${isEdit ? 'added' : 'edited'} successfully`);
    return closeModal();
  } catch (error: any) {
    if (error.response?.status === 422) {
      return toast.error(error.response.data);
    }

    toast.error('Something went wrong, please try again later.');
  }
};

export default handleMonitor;
