import { toast } from 'sonner';
import { createPostRequest } from '../services/axios';

const handleMonitor = async (form, isEdit, closeModal, setMonitor) => {
  try {
    const apiPath = isEdit ? '/api/monitor/edit' : '/api/monitor/add';

    const { type } = form;

    if (type === 'http') {
      const {
        name,
        url,
        method,
        valid_status_codes,
        interval,
        retryInterval,
        requestTimeout,
        monitorId,
      } = form;

      const query = await createPostRequest(apiPath, {
        type,
        name,
        url,
        method,
        valid_status_codes,
        interval,
        retryInterval,
        requestTimeout,
        monitorId,
      });

      setMonitor(query.data);
    } else {
      const {
        name,
        host,
        port,
        interval,
        retryInterval,
        requestTimeout,
        monitorId,
      } = form;

      const query = await createPostRequest(apiPath, {
        type,
        name,
        host,
        port,
        interval,
        retryInterval,
        requestTimeout,
        monitorId,
      });

      setMonitor(query.data);
    }

    toast.success(`Monitor been ${isEdit ? 'added' : 'edited'} successfully`);
    return closeModal();
  } catch (error) {
    console.log(error);
    toast.error('Something went wrong, please try again later.');
  }
};

export default handleMonitor;
