// import dependencies
import { toast } from 'react-toastify';
import { Button, Modal, Textarea } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import Tabs from '../../ui/tabs';
import useContextStore from '../../../context';
import IncidentMonitors from '../../incident/monitors';
import useIncidentMessage from '../../../hooks/useIncidentMessage';

const IncidentAddUpdateModal = ({ incidentId }) => {
  const {
    incidentStore: { getIncidentById, addIncident },
    modalStore: { closeModal },
  } = useContextStore();

  const incident = getIncidentById(incidentId);

  const { values, dispatch, handleSubmit } = useIncidentMessage(
    {
      monitorIds: incident?.monitorIds || [],
      status: incident?.status || 'Investigating',
      message: '',
    },
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
      const data = await handleSubmit();

      addIncident(data);
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!incident) return null;

  return (
    <Modal
      size="lg"
      title="Add an update"
      actions={
        <>
          <Button onClick={closeModal} color="red" variant="flat">
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={updateIncidentStatus}>
            Add Update
          </Button>
        </>
      }
      onClose={closeModal}
    >
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
    </Modal>
  );
};

export default observer(IncidentAddUpdateModal);
