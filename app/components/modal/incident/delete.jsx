import Modal from '../../ui/modal';

const DeleteIncidentModal = ({ handleDelete, closeModal }) => {
  return (
    <Modal.Container>
      <Modal.Title>Delete Incident</Modal.Title>
      <Modal.Message>
        Are you sure you want to delete this incident?
        <br />
        This is an irreversible action.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button color="red" onClick={handleDelete}>
          Delete
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

export default DeleteIncidentModal;
