// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../../../../services/axios';
import Modal from '../../../ui/modal';
import useTeamContext from '../../../../context/team';
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
    <>
      <Modal.Title>Remove user?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By confirming you will be removing
        <span style={{ fontWeight: '600' }}> {member.email}</span> from the
        accessing the dashboard. Their account will be removed from the
        database.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={onClose}>Cancel</Modal.Button>
        <Modal.Button color="red" onClick={handleConfirm}>
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

MemberDeleteModal.displayName = 'MemberDeleteModal';

MemberDeleteModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MemberDeleteModal;
