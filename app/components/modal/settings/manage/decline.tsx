// import dependencies
import { toast } from 'react-toastify';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import useTeamContext from '../../../../context/team';
import { createPostRequest } from '../../../../services/axios';

const MemberDeclineModal = ({ member, onClose }) => {
  const { removeUser } = useTeamContext();

  const handleConfirm = async () => {
    try {
      await createPostRequest('/api/user/access/decline', {
        email: member.email,
      });

      removeUser(member.email);

      toast.success('User request declined successfully.');
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error declining user's request.");
    }
  };

  return (
    <Modal
      title="Decline user request?"
      actions={
        <>
          <Button
            color="red"
            variant="flat"
            id="manage-cancel-button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            id="manage-decline-button"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      }
      size="xs"
    >
      By confirming you will be declining
      <span style={{ fontWeight: '600' }}> {member.email}</span> request to
      access the dashboard. Their account will be removed from the database.
    </Modal>
  );
};

MemberDeclineModal.displayName = 'MemberDeclineModal';

export default MemberDeclineModal;
