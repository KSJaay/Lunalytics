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
import { useNavigate } from 'react-router-dom';

// import local files
import TextInput from '../../components/ui/input';
import MonitorForm from '../../components/ui/form/monitor';
import Dropdown from '../../components/ui/dropdown';
import * as validators from '../../utils/validators';
import { createPostRequest } from '../../services/axios';

const AddMonitor = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name?.value;
    const url = e.target.url?.value;
    const method = e.target.method?.value;
    const interval = e.target.interval?.value;
    const retryInterval = e.target.retryInterval?.value;
    const requestTimeout = e.target.requestTimeout?.value;

    const hasInvalidData = validators.monitor(
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout
    );

    if (hasInvalidData) {
      setError(hasInvalidData);
      return;
    }

    const query = await createPostRequest('/monitor/add', {
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout,
    });

    if (query.status !== 200) {
      setError(query.data.message);
      return;
    }

    navigate('/');
  };

  return (
    <MonitorForm
      onSubmit={handleSubmit}
      error={error}
      title={'Add New Monitor'}
    >
      <TextInput
        label="Name"
        id="name"
        type="text"
        placeholder="Monitor Name"
      />
      <TextInput label="URL" id="url" defaultValue="https://" type="text" />
      <Dropdown
        id="method"
        label="Method"
        options={[
          { value: 'DELETE', name: 'DELETE' },
          { value: 'GET', name: 'GET' },
          { value: 'HEAD', name: 'HEAD' },
          { value: 'OPTIONS', name: 'OPTIONS' },
          { value: 'PATCH', name: 'PATCH' },
          { value: 'POST', name: 'POST' },
          { value: 'PUT', name: 'PUT' },
        ]}
      />
      <TextInput
        label="Interval"
        defaultValue={30}
        id="interval"
        type="number"
      />
      <TextInput
        label="Retry Interval"
        defaultValue={60}
        id="retryInterval"
        type="number"
      />
      <TextInput
        label="Request timout"
        id="requestTimeout"
        defaultValue={30}
        type="number"
      />
    </MonitorForm>
  );
};

export default AddMonitor;
