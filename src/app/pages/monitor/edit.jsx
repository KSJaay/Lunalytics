// Name
// URL
// Interval
// Retry Interval
// Request Timeout
// Acceptable Status Codes (200-299, 300-399, 400-499, 500-599, or select a specific one) (Dropdown)
// Method - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS (Dropdown)
// Headers - Textarea (JSON format)

// import node_modules
import { useState } from 'react';

// import local files
import TextInput from '../../components/ui/input';
import * as validators from '../../../shared/validators';
import MonitorForm from '../../components/ui/form/monitor';

const EditMonitor = ({ monitor = {} }) => {
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const url = e.target.url.value;
    const interval = e.target.interval.value;
    const retryInterval = e.target.retryInterval.value;
    const requestTimeout = e.target.requestTimeout.value;

    const hasInvalidData = validators.monitor(
      name,
      url,
      interval,
      retryInterval,
      requestTimeout
    );

    if (hasInvalidData) {
      setError(hasInvalidData);
    }
  };

  return (
    <MonitorForm onSubmit={handleSubmit} error={error} title={'Update Monitor'}>
      <TextInput
        label="Name"
        id="name"
        type="text"
        defaultValue={monitor.name || ''}
      />
      <TextInput
        label="URL"
        id="url"
        type="text"
        defaultValue={monitor.url || 'https://'}
      />
      <TextInput
        label="Interval"
        id="interval"
        type="number"
        defaultValue={monitor.interval || 30}
      />
      <TextInput
        label="Retry Interval"
        id="retryInterval"
        type="number"
        defaultValue={monitor.retryInterval || 60}
      />
      <TextInput
        label="Request timout"
        id="requestTimeout"
        type="number"
        defaultValue={monitor.requestTimeout || 30}
      />
    </MonitorForm>
  );
};

export default EditMonitor;
