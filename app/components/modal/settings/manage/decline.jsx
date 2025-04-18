// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../../../../services/axios';
import Modal from '../../../ui/modal';
import useTeamContext from '../../../../context/team';
import { userPropType } from '../../../../../shared/utils/propTypes';

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
    } catch {
      toast.error("Error declining user's request.");
    }
  };

  return (
    <>
      <Modal.Title>Decline user request?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By confirming you will be declining
        <span style={{ fontWeight: '600' }}> {member.email}</span> request to
        access the dashboard. Their account will be removed from the database.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button id="manage-cancel-button" onClick={onClose}>
          Cancel
        </Modal.Button>
        <Modal.Button
          id="manage-decline-button"
          color="green"
          onClick={handleConfirm}
        >
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

MemberDeclineModal.displayName = 'MemberDeclineModal';

MemberDeclineModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MemberDeclineModal;
