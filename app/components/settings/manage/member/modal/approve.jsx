import { toast } from 'sonner';
import { createPostRequest } from '../../../../../services/axios';
import Modal from '../../../../ui/modal';

const MemberApproveModal = ({ member, onClose }) => {
  const handleConfirm = async () => {
    try {
      await createPostRequest('/api/user/access/approve', {
        email: member.email,
      });

      toast.success('User request declined successfully.');

      onClose();
    } catch (error) {
      toast.error("Error declining user's request.");
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
        <Modal.Button onClick={onClose}>Cancel</Modal.Button>
        <Modal.Button color="green" onClick={handleConfirm}>
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

export default MemberApproveModal;