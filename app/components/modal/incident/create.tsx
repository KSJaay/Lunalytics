// import dependencies
import { toast } from 'react-toastify';
import { Textarea, Input, Button, Modal } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import useIncidentForm from '../../../hooks/useIncidentForm';
import Tabs from '../../ui/tabs';
import IncidentMonitors from '../../incident/monitors';
import useContextStore from '../../../context';

const IncidentCreateModal = () => {
  const {
    modalStore: { closeModal },
    incidentStore: { addIncident },
  } = useContextStore();
  const { values, dispatch, handleSubmit } = useIncidentForm();

  const handleSelectedMonitor = (monitorId: never) => {
    const monitors = values.monitorIds;

    if (monitors.includes(monitorId)) {
      dispatch({
        key: 'monitorIds',
        value: monitors.filter((id) => id !== monitorId),
      });
    } else {
      dispatch({ key: 'monitorIds', value: [...monitors, monitorId] });
    }
  };

  const handleChange = (key: string, value: any) => {
    dispatch({ key, value });
  };

  const submitForm = async () => {
    try {
      const incident = await handleSubmit();

      addIncident(incident);
      closeModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      size="xl"
      title="Create an Incident"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={submitForm}>
            Create
          </Button>
        </>
      }
      onClose={closeModal}
    >
      <Input
        title="Incident Title"
        id="incident-name"
        maxLength={100}
        value={values.title || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange('title', e.target.value)
        }
        subtitle="Breif description (maximum of 100 characters)"
      />

      <IncidentMonitors
        values={values}
        handleSelectedMonitor={handleSelectedMonitor}
        handleChange={handleChange}
      />

      <Textarea
        label="Message"
        id="incident-message"
        disableResize
        rows={5}
        value={values.message || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange('message', e.target.value)
        }
        shortDescription="Information about the incident"
      />

      <Tabs
        id="incident-status-create"
        label="Status:"
        shortDescription="Current status of the incident"
        options={[
          { value: 'Investigating', color: 'red' },
          { value: 'Identified', color: 'yellow' },
          { value: 'Monitoring', color: 'blue' },
          { value: 'Resolved', color: 'green' },
        ]}
        onChange={(value) => handleChange('status', value)}
        activeOption={values.status}
      />
    </Modal>
  );
};

IncidentCreateModal.displayName = 'IncidentCreateModal';

export default observer(IncidentCreateModal);
