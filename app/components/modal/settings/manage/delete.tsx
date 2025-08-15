// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import useTeamContext from '../../../../context/team';
import { createPostRequest } from '../../../../services/axios';
import { userPropType } from '../../../../../shared/utils/propTypes';

const MemberDeleteModal = ({ member, onClose }) => {
  const { removeUser } = useTeamContext();

  const handleConfirm = async () => {
    try {
      await createPostRequest('/api/user/access/remove', {
        email: member.email,
      });

      removeUser(member.email);

      toast.success('User has been removed successfully.');
      onClose();
    } catch {
      toast.error("Error declining user's request.");
    }
  };

  return (
    <Modal
      title="Remove user?"
      actions={
        <>
          <Button color="gray" variant="flat" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" variant="flat" onClick={handleConfirm}>
            Confirm
          </Button>
        </>
      }
      size="xs"
    >
      By confirming you will be removing
      <span style={{ fontWeight: '600' }}> {member.email}</span> from the
      accessing the dashboard. Their account will be removed from the database.
    </Modal>
  );
};

MemberDeleteModal.displayName = 'MemberDeleteModal';

MemberDeleteModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MemberDeleteModal;
