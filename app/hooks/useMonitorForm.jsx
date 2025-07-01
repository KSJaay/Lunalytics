import { useState } from 'react';
import handleMonitor from '../handlers/monitor';
import monitorValidators from '../../shared/validators/monitor';

const defaultInputs = {
  type: 'http',
  method: 'HEAD',
  interval: 60,
  retryInterval: 60,
  requestTimeout: 30,
  notificationType: 'All',
  valid_status_codes: ['200-299'],
};

const useMonitorForm = (
  values = defaultInputs,
  isEdit,
  closeModal,
  setMonitor
) => {
  const [inputs, setInput] = useState(values);
  const [errors, setErrors] = useState({});

  const handleInput = (name, value) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionButtons = (action) => () => {
    switch (action) {
      case 'Create': {
        const validator = monitorValidators[inputs.type];
        if (!validator) return;

        const errorsObj = validator(inputs);

        if (errorsObj) {
          setErrors(errorsObj);
          break;
        }

        setErrors({});

        handleMonitor(inputs, isEdit, closeModal, setMonitor);
        break;
      }

      case 'Cancel': {
        closeModal();
        break;
      }

      default:
        break;
    }
  };

  return { inputs, errors, handleActionButtons, handleInput };
};

export default useMonitorForm;
