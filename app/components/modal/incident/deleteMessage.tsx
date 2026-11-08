// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import { createPostRequest } from '../../../services/axios';
import useIncidentContext from '../../../context/incidents';
import useModalContext from '../../../context/modal';

const IncidentDeleteMessageModal = ({
  incidentId,
  incidentPosition,
}: {
  incidentId: string;
  incidentPosition: number;
}) => {
  const { closeModal } = useModalContext();
  const { addIncident } = useIncidentContext();

  const deleteIncidentMessage = async () => {
    try {
      const query = await createPostRequest('/api/incident/messages/delete', {
        incidentId,
        position: incidentPosition,
      });

      addIncident(query.data);
      closeModal();
      toast.success('Incident message deleted successfully!');
    } catch (error: any) {
      if (error?.response?.data?.message) {
        return toast.error(error.response.data.message);
      }

      toast.error('Something went wrong! Please try again later.');
    }
  };

  return (
    <Modal
      title="Delete incident message"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={deleteIncidentMessage}>
            Confirm
          </Button>
        </>
      }
      size="xs"
    >
      <div>
        Are you sure you want to delete this message? <br /> This is
        irreversible.
      </div>
    </Modal>
  );
};

export default observer(IncidentDeleteMessageModal);
