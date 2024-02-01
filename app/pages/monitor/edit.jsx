// import dependencies
import { toast } from 'sonner';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';

// import local files
import useContextStore from '../../context';
import TextInput from '../../components/ui/input';
import * as validators from '../../utils/validators';
import MonitorForm from '../../components/ui/form/monitor';
import Dropdown from '../../components/ui/dropdown';
import { createPostRequest } from '../../services/axios';
import useDropdown from '../../hooks/useDropdown';

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];

const EditMonitor = () => {
  const [error, setError] = useState(null);
  const {
    globalStore: { editMonitor, getMonitor },
  } = useContextStore();

  const navigate = useNavigate();
  const [queries] = useSearchParams();

  const monitorId = queries.get('monitorId');
  const monitor = getMonitor(monitorId);

  const { selectedId, dropdownIsOpen, toggleDropdown, handleDropdownSelect } =
    useDropdown(true, monitor?.method);

  const methodOptions = methods.map((methodName) => (
    <Dropdown.Item
      key={methodName}
      onClick={() => handleDropdownSelect(methodName)}
      showDot
      isSelected={selectedId === methodName}
    >
      {methodName}
    </Dropdown.Item>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!monitor) {
      toast.error('Did not find a monitor with that ID.');
      return navigate('/');
    }

    const name = e.target.name?.value;
    const url = e.target.url?.value;
    const interval = e.target.interval?.value;
    const retryInterval = e.target.retryInterval?.value;
    const requestTimeout = e.target.requestTimeout?.value;

    const hasInvalidData = validators.monitor(
      name,
      url,
      selectedId,
      interval,
      retryInterval,
      requestTimeout
    );

    if (hasInvalidData) {
      setError(hasInvalidData);
      return;
    }

    const query = await createPostRequest('/api/monitor/edit', {
      monitorId,
      name,
      url,
      method: selectedId,
      interval,
      retryInterval,
      requestTimeout,
    });

    if (query.status !== 200) {
      setError(query.data.message);
      return;
    }

    editMonitor(query.data.monitorId, query.data);

    toast.success('Monitor edited successfully!');
    navigate('/');
  };

  return (
    <MonitorForm onSubmit={handleSubmit} error={error} title={'Edit Monitor'}>
      <TextInput
        label="Name"
        id="name"
        type="text"
        placeholder="Monitor Name"
        defaultValue={monitor?.name}
      />
      <TextInput
        label="URL"
        id="url"
        type="text"
        defaultValue={monitor?.url || 'https://'}
      />
      <label className="text-input-label">Method</label>
      <Dropdown.Container
        id="method"
        position="center"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          showIcon
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {selectedId || 'Select a method'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {methodOptions}
        </Dropdown.List>
      </Dropdown.Container>
      <TextInput
        label="Interval"
        id="interval"
        type="number"
        defaultValue={monitor?.interval || 30}
      />
      <TextInput
        label="Retry Interval"
        id="retryInterval"
        type="number"
        defaultValue={monitor?.retryInterval || 60}
      />
      <TextInput
        label="Request timout"
        id="requestTimeout"
        type="number"
        defaultValue={monitor?.requestTimeout || 30}
      />
    </MonitorForm>
  );
};

EditMonitor.displayName = 'EditMonitor';

export default observer(EditMonitor);
