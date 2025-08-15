import { useState } from 'react';
import handleMonitor from '../handlers/monitor';
import monitorValidators from '../../shared/validators/monitor';
import type { ContextMonitorProps } from '../types/context/global';

const defaultInputs = {
  type: 'http',
  method: 'HEAD',
  retry: 1,
  interval: 60,
  retryInterval: 60,
  requestTimeout: 30,
  notificationType: 'All',
  valid_status_codes: ['200-299'],
  json_query: [{ key: '', operator: '==', value: '' }],
};

const useMonitorForm = (
  values = defaultInputs,
  isEdit: boolean,
  closeModal: () => void,
  setMonitor: (monitor: ContextMonitorProps) => void
) => {
  const [inputs, setInput] = useState({ ...defaultInputs, ...values });
  const [errors, setErrors] = useState({});

  const handleInput = (name: string, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionButtons = (action: string) => () => {
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
