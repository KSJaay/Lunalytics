// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';

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
      retryInterval,
      requestTimeout,
      monitorId,
      notificationId,
      notificationType,
    } = form;

    const query = await createPostRequest(apiPath, {
      name,
      type,
      url,
      method,
      port,
      valid_status_codes,
      interval,
      retryInterval,
      requestTimeout,
      monitorId,
      notificationId,
      notificationType,
    });

    setMonitor(query.data);

    toast.success(`Monitor been ${isEdit ? 'added' : 'edited'} successfully`);
    return closeModal();
  } catch (error) {
    console.log(error);

    if (error.response?.status === 422) {
      return toast.error(error.response.data);
    }

    toast.error('Something went wrong, please try again later.');
  }
};

export default handleMonitor;
