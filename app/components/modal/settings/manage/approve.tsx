// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import { createPostRequest } from '../../../../services/axios';
import useTeamContext from '../../../../context/team';

const MemberApproveModal = ({ member, onClose }) => {
  const { updateUserVerified } = useTeamContext();

  const handleConfirm = async () => {
    try {
      await createPostRequest('/api/user/access/approve', {
        email: member.email,
      });

      updateUserVerified(member.email);

      toast.success('User request approved successfully.');
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error approving user's request.");
    }
  };

  return (
    <Modal
      title="Are you sure?"
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
            id="manage-approve-button"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      }
      onClose={onClose}
      size="xs"
    >
      By continuing you will be allowing{' '}
      <span style={{ fontWeight: '600' }}>{member.email} </span> to{' '}
      <span style={{ fontWeight: '600' }}>access</span> the dashboard. The user
      will have access to view the monitors.
    </Modal>
  );
};

MemberApproveModal.displayName = 'MemberApproveModal';

export default observer(MemberApproveModal);
