// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import Modal from '../../ui/modal';
import useContextStore from '../../../context';
import { createPostRequest } from '../../../services/axios';

const IncidentDeleteMessageModal = ({ incidentId, incidentPosition }) => {
  const {
    incidentStore: { addIncident },
    modalStore: { closeModal },
  } = useContextStore();

  const deleteIncidentMessage = async () => {
    try {
      const query = await createPostRequest('/api/incident/messages/delete', {
        incidentId,
        position: incidentPosition,
      });

      addIncident(query.data);
      closeModal();
      toast.success('Incident message deleted successfully!');
    } catch (error) {
      console.log(error);

      if (error?.response?.data?.message) {
        return toast.error(error.response.data.message);
      }

      toast.error('Something went wrong! Please try again later.');
    }
  };

  return (
    <Modal.Container>
      <Modal.Title style={{ textAlign: 'center' }}>
        Delete incident message
      </Modal.Title>
      <Modal.Message>
        Are you sure you want to delete this message? <br /> This is
        irreversible.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button color="red" onClick={deleteIncidentMessage}>
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

export default observer(IncidentDeleteMessageModal);
