// import dependencies
import { toast } from 'sonner';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import TextInput from '../../components/ui/input';
import MonitorForm from '../../components/ui/form/monitor';
import Dropdown from '../../components/ui/dropdown';
import * as validators from '../../utils/validators';
import { createPostRequest } from '../../services/axios';
import useContextStore from '../../context';

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];

const AddMonitor = () => {
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(null);
  const {
    globalStore: { addMonitor },
  } = useContextStore();
  const navigate = useNavigate();

  const methodOptions = methods.map((method) => (
    <Dropdown.Item key={method} onClick={() => setMethod(method)}>
      {method}
    </Dropdown.Item>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name?.value;
    const url = e.target.url?.value;
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

    const query = await createPostRequest('/api/monitor/add', {
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

    addMonitor(query.data);

    toast.success('Monitor added successfully!');

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
      <label className="text-input-label">Method</label>
      <Dropdown.Container id="method" position="center">
        <Dropdown.Trigger asInput>
          {method || 'Select a method'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth>{methodOptions}</Dropdown.List>
      </Dropdown.Container>
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

AddMonitor.displayName = 'AddMonitor';

export default observer(AddMonitor);
