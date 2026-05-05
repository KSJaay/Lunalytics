import { Button, Modal } from '@lunalytics/ui';

const ArchiveIncidentModal = ({
  handleArchive,
  closeModal,
}: {
  handleArchive: () => void;
  closeModal: () => void;
}) => {
  return (
    <Modal
      title="Archive Incident"
      size="xs"
      actions={
        <>
          <Button
            id="incident-archive-modal-cancel-button"
            color="green"
            variant="flat"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            id="incident-archive-modal-confirm-button"
            color="red"
            variant="flat"
            onClick={handleArchive}
          >
            Archive
          </Button>
        </>
      }
      onClose={closeModal}
    >
      <div>
        Are you sure you want to archive this incident?
        <br />
        This is an irreversible action.
      </div>
    </Modal>
  );
};

export default ArchiveIncidentModal;
