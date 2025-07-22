import Modal from '../../ui/modal';

const ArchiveIncidentModal = ({ handleArchive, closeModal }) => {
  return (
    <Modal.Container>
      <Modal.Title style={{ textAlign: 'center' }}>
        Archive Incident
      </Modal.Title>
      <Modal.Message>
        Are you sure you want to archive this incident?
        <br />
        This is an irreversible action.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button color="red" onClick={handleArchive}>
          Archive
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

export default ArchiveIncidentModal;
