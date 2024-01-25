import { toast } from 'sonner';
import { createPostRequest } from '../../../../../services/axios';
import Modal from '../../../../ui/modal';

const MemberDeleteModal = ({ member, onClose }) => {
  const handleConfirm = async () => {
    try {
      await createPostRequest('/api/user/access/remove', {
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

export default MemberDeleteModal;
