// import dependencies
import { toast } from 'react-toastify';
import { Textarea } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import Tabs from '../../ui/tabs';
import Modal from '../../ui/modal';
import useContextStore from '../../../context';
import IncidentMonitors from '../../incident/monitors';
import useIncidentMessage from '../../../hooks/useIncidentMessage';

const IncidentEditMessageModal = ({ incidentId, incidentPosition }) => {
  const {
    incidentStore: { getIncidentById, addIncident },
    modalStore: { closeModal },
  } = useContextStore();

  const incident = getIncidentById(incidentId);
  const {
    monitorIds = [],
    status = '',
    message = '',
  } = incident?.messages[incidentPosition] || {};

  const { values, dispatch, handleSubmit } = useIncidentMessage(
    { monitorIds, status, message },
    incidentId
  );

  const handleSelectedMonitor = async (monitorId) => {
    const monitorIds = values.monitorIds;

    if (monitorIds.includes(monitorId)) {
      dispatch({
        key: 'monitorIds',
        value: monitorIds.filter((id) => id !== monitorId),
      });
    } else {
      dispatch({ key: 'monitorIds', value: [...monitorIds, monitorId] });
    }
  };

  const updateIncidentStatus = async () => {
    try {
      const data = await handleSubmit(incidentPosition);

      addIncident(data);

      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!incident) return null;

  return (
    <Modal.Container contentProps={{ style: { width: '1200px' } }}>
      <Modal.Title style={{ textAlign: 'center', marginBottom: '0' }}>
        Add an update
      </Modal.Title>
      <Modal.Message>
        <IncidentMonitors
          values={{ monitorIds: values?.monitorIds }}
          handleSelectedMonitor={handleSelectedMonitor}
        />

        <Textarea
          label="Message"
          id="incident-message"
          disableResize
          rows={5}
          value={values.message || ''}
          onChange={(e) => dispatch({ key: 'message', value: e.target.value })}
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
          onChange={(value) => dispatch({ key: 'status', value })}
          activeOption={values.status}
        />
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button color="green" onClick={updateIncidentStatus}>
          Add Update
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

export default observer(IncidentEditMessageModal);
