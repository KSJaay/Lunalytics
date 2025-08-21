import { useState } from 'react';
import handleMonitor from '../handlers/monitor';
import monitorValidators from '../../shared/validators/monitor';
import type { MonitorProps } from '../types/monitor';

const defaultInputs = {
  type: 'http' as MonitorProps['type'],
  method: 'HEAD',
  retry: 1,
  interval: 60,
  retryInterval: 60,
  requestTimeout: 30,
  notificationType: 'All',
  valid_status_codes: ['200-299'],
  json_query: [{ key: '', operator: '==', value: '' }],
  icon: {
    id: 'lunalytics',
    name: 'Lunalytics',
    url: `https://cdn.jsdelivr.net/gh/selfhst/icons/svg/lunalytics.svg`,
  },
};

const useMonitorForm = (
  values: Partial<MonitorProps> = defaultInputs,
  isEdit: boolean = false,
  closeModal: () => void,
  setMonitor: (monitor: Partial<MonitorProps>) => void
) => {
  const [inputs, setInput] = useState<Partial<MonitorProps>>({
    ...defaultInputs,
    ...values,
  });
  const [errors, setErrors] = useState({});

  const handleInput = (name: string, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionButtons = (action: string) => () => {
    switch (action) {
      case 'Create': {
        const type = inputs.type ?? defaultInputs.type;
        const validator = monitorValidators[type];
        if (!validator) return console.log("Validator doesn't exist");

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
