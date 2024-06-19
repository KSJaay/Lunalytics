// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import { createPostRequest } from '../../../../services/axios';
import Modal from '../../../ui/modal';
import useTeamContext from '../../../../context/team';
import { userPropType } from '../../../../../shared/utils/propTypes';

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
    <>
      <Modal.Title>Are you sure?</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        By continuing you will be allowing{' '}
        <span style={{ fontWeight: '600' }}>{member.email} </span> to{' '}
        <span style={{ fontWeight: '600' }}>access</span> the dashboard. The
        user will have access to view the monitors.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button id="manage-cancel-button" onClick={onClose}>
          Cancel
        </Modal.Button>
        <Modal.Button
          id="manage-approve-button"
          color="green"
          onClick={handleConfirm}
        >
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

MemberApproveModal.displayName = 'MemberApproveModal';

MemberApproveModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default observer(MemberApproveModal);
