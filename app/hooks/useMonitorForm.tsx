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
  setMonitor: (monitor: Partial<MonitorProps>) => void,
  setPageId: (id: string) => void,
) => {
  const [inputs, setInput] = useState<Partial<MonitorProps>>({
    ...defaultInputs,
    ...values,
  });
  const [errors, setErrors] = useState({});
  const [errorPages, setErrorPages] = useState<Set<string>>(new Set())

  const handleInput = (name: string, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const getPagesWithErrors = (errorsObj: Record<string,string>) => {
    
    const associatedPage: Record<string, string> = {
      'name': "basic",
      'type': "basic",
      'url': "basic",
      'port': "basic",
      'icon': "basic",
      'method': "basic",
      'json_query': "basic",
      'interval': "interval",
      'retry': "interval",
      'retryInterval': "interval",
      'requestTimeout': "interval",
      'notificationType': "notification",
      'headers': "advanced",
      'body': "advanced",
      'valid_status_codes': "advanced",
    }
    const pagesWithError = new Set<string>();
    
    Object.keys(errorsObj).forEach(error => {
      const page = associatedPage[error]
      if(error && page) pagesWithError.add(page)
    })

    return pagesWithError
  }


  const handleActionButtons = (action: string) => () => {
    switch (action) {
      case 'Create': {
        const type = inputs.type ?? defaultInputs.type;
        const validator = monitorValidators[type];
        if (!validator) return console.log("Validator doesn't exist");

        const errorsObj = validator(inputs) as Record<string, string> | false;

        if (errorsObj !== false) {
          const pagesWithErrors = getPagesWithErrors(errorsObj)
          setErrorPages(pagesWithErrors);
          setPageId(Array.from(pagesWithErrors)[0])

          setErrors(errorsObj);     
          break;
        }

        setErrorPages(new Set<string>())
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

  return { inputs, errors, handleActionButtons, handleInput, errorPages, setErrorPages };
};

export default useMonitorForm;
