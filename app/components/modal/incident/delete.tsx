import { Button, Modal } from '@lunalytics/ui';

const DeleteIncidentModal = ({
  handleDelete,
  closeModal,
}: {
  handleDelete: () => void;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title="Delete Incident"
      actions={
        <>
          <Button
            id="incident-delete-modal-cancel-button"
            color="gray"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            id="incident-delete-modal-confirm-button"
            color="red"
            variant="flat"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </>
      }
      size="xs"
      onClose={closeModal}
    >
      <div>
        Are you sure you want to delete this incident?
        <br />
        This is an irreversible action.
      </div>
    </Modal>
  );
};

export default DeleteIncidentModal;
