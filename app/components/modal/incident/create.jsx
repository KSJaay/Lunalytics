import '../../../styles/pages/incidents.scss';

// import dependencies
import { toast } from 'react-toastify';
import { Textarea } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import useIncidentForm from '../../../hooks/useIncidentForm';
import Tabs from '../../ui/tabs';
import Modal from '../../ui/modal';
import TextInput from '../../ui/input';
import IncidentMonitors from '../../incident/monitors';
import useContextStore from '../../../context';

const IncidentCreateModal = () => {
  const {
    modalStore: { closeModal },
    incidentStore: { addIncident },
  } = useContextStore();
  const { values, dispatch, handleSubmit } = useIncidentForm();

  const handleSelectedMonitor = (monitorId) => {
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

  const handleChange = (key, value) => {
    dispatch({ key, value });
  };

  const submitForm = async (isEdit) => {
    try {
      const incident = await handleSubmit(isEdit);

      addIncident(incident);
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal.Container>
      <Modal.Title>Create an Incident</Modal.Title>
      <Modal.Message className="modal-message ic-container">
        <TextInput
          label="Incident Title"
          id="incident-name"
          maxLength={100}
          value={values.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          shortDescription="Breif description (maximum of 100 characters)"
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
          onChange={(e) => handleChange('message', e.target.value)}
          shortDescription="Information about the incident"
        />

        <Tabs
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
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button color="green" onClick={submitForm}>
          Create
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

IncidentCreateModal.displayName = 'IncidentCreateModal';

export default observer(IncidentCreateModal);
