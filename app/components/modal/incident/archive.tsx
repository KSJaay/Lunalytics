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
          <Button color="green" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="red" variant="flat" onClick={handleArchive}>
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
