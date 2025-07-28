// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';

const parseJson = (str) => {
  try {
    if (typeof str === 'string') {
      return JSON.parse(str);
    }
    if (typeof str === 'object') {
      if (Array.isArray(str)) return {};
      return str;
    }

    return {};
  } catch {
    return {};
  }
};

const handleMonitor = async (form, isEdit, closeModal, setMonitor) => {
  try {
    const apiPath = isEdit ? '/api/monitor/edit' : '/api/monitor/add';

    const {
      name,
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
    } = form;

    const parsedHeaders = parseJson(headers);
    const parsedBody = parseJson(body);

    const query = await createPostRequest(apiPath, {
      name,
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
    });

    setMonitor(query.data);

    toast.success(`Monitor been ${isEdit ? 'added' : 'edited'} successfully`);
    return closeModal();
  } catch (error) {
    if (error.response?.status === 422) {
      return toast.error(error.response.data);
    }

    toast.error('Something went wrong, please try again later.');
  }
};

export default handleMonitor;
