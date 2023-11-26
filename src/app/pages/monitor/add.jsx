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
import * as validators from '../../utils/validators';
import MonitorForm from '../../components/ui/form/monitor';

const AddMonitor = () => {
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
    <MonitorForm
      onSubmit={handleSubmit}
      error={error}
      title={'Add New Monitor'}
    >
      <TextInput label="Name" id="name" type="text" />
      <TextInput label="URL" id="name" defaultValue="https://" type="text" />
      <TextInput label="Interval" defaultValue={30} id="name" type="number" />
      <TextInput
        label="Retry Interval"
        defaultValue={60}
        id="name"
        type="number"
      />
      <TextInput
        label="Request timout"
        id="name"
        defaultValue={30}
        type="number"
      />
    </MonitorForm>
  );
};

export default AddMonitor;
