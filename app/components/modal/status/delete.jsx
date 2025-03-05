// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';

const StatusDeleteModal = ({ closeModal, deleteStatusPage, title }) => {
  return (
    <Modal.Container>
      <Modal.Title style={{ textAlign: 'center', fontSize: 'var(--font-xl)' }}>
        Are you absolutely sure?
      </Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By continuing you will be deleting {title} status page, along with all
        data related with this status page.{' '}
        <span style={{ fontWeight: '600' }}>This action cannot be undone.</span>
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Close</Modal.Button>
        <Modal.Button
          color="green"
          id="status-page-delete-button"
          onClick={() => {
            deleteStatusPage();
            closeModal();
          }}
        >
          Delete
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

StatusDeleteModal.displayName = 'StatusDeleteModal';

StatusDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteStatusPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default StatusDeleteModal;
