import { useState } from 'react';
import handleMonitor from '../handlers/monitor';
import monitorValidators from '../utils/validators/monitor';

const initialPage = {
  page: 1,
  name: 'initial',
  actions: ['Next'],
  inputs: [
    { name: 'type', validator: monitorValidators.type },
    { name: 'name', validator: monitorValidators.name },
  ],
};

const httpPages = {
  page: 2,
  name: 'http',
  actions: ['Previous', 'Next'],
  inputs: [
    { name: 'url', validator: monitorValidators.httpUrl },
    { name: 'method', validator: monitorValidators.httpMethod },
    {
      name: 'valid_status_codes',
      validator: monitorValidators.httpStatusCodes,
    },
  ],
};

const tcpPages = {
  page: 2,
  name: 'tcp',
  actions: ['Previous', 'Next'],
  inputs: [
    { name: 'host', validator: monitorValidators.tcpHost },
    { name: 'port', validator: monitorValidators.tcpPort },
  ],
};

const intervalPage = {
  page: 3,
  name: 'interval',
  actions: ['Previous', 'Submit'],
  inputs: [
    { name: 'interval', validator: monitorValidators.interval },
    { name: 'retryInterval', validator: monitorValidators.retryInterval },
    { name: 'requestTimeout', validator: monitorValidators.requestTimeout },
  ],
};

const defaultInputs = {
  valid_status_codes: ['200-299'],
  interval: 60,
  retryInterval: 60,
  requestTimeout: 30,
};

const useMonitorForm = (
  values = defaultInputs,
  isEdit,
  closeModal,
  setMonitor
) => {
  const [form, setForm] = useState(initialPage);
  const [inputs, setInput] = useState(values);
  const [errors, setErrors] = useState({});

  const handleInput = (name, value) => {
    setInput({ ...inputs, [name]: value });
  };

  const handlePageNext = () => {
    const errorsObj = {};

    form.inputs.forEach((input) => {
      const { name, validator } = input;
      const value = inputs[name];

      if (validator) {
        const error = validator(value);

        if (error) {
          errorsObj[name] = error;
        }
      }
    });

    if (Object.keys(errorsObj).length) {
      setErrors(errorsObj);
      return;
    }

    const type = inputs.type;

    if (type === 'http' && form.page === 1) {
      setForm(httpPages);
    }

    if (type === 'tcp' && form.page === 1) {
      setForm(tcpPages);
    }

    if (form.page === 2) {
      setForm(intervalPage);
    }

    setErrors({});
  };

  const handlePagePrevious = () => {
    if (form.page === 1) {
      return;
    }

    if (form.page === 2) {
      setForm(initialPage);
      return;
    }

    if (inputs.type === 'http') {
      setForm(httpPages);
      return;
    }

    if (inputs.type === 'tcp') {
      setForm(tcpPages);
      return;
    }
  };

  const handleActionButtons = (action) => () => {
    switch (action) {
      case 'Next':
        handlePageNext();
        break;
      case 'Previous':
        handlePagePrevious();
        break;
      case 'Submit': {
        const errorsObj = {};

        form.inputs.forEach((input) => {
          const { name, validator } = input;
          const value = inputs[name];

          if (validator) {
            const error = validator(value);

            if (error) {
              errorsObj[name] = error;
            }
          }
        });

        if (Object.keys(errorsObj).length) {
          setErrors(errorsObj);
          return;
        }

        setErrors({});

        handleMonitor(inputs, isEdit, closeModal, setMonitor);
        break;
      }
      default:
        break;
    }
  };

  return {
    form,
    inputs,
    errors,
    handleActionButtons,
    handleInput,
  };
};

export default useMonitorForm;
