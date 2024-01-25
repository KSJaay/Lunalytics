import { useState } from 'react';
import { toast } from 'sonner';
import { createPostRequest } from '../../../../../services/axios';
import Modal from '../../../../ui/modal';

const MemeberPermission = ({ title, description, isActive, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: isActive
          ? '2px solid var(--green-500)'
          : '2px solid var(--accent-600)',
        padding: '5px 8px',
        borderRadius: '8px',
        backgroundColor: 'var(--accent-700)',
        boxShadow: 'var(--shadow-sm)',
      }}
      {...props}
    >
      <div
        style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '5px',
          color: isActive ? 'var(--green-600)' : 'var(--font-color)',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: 'var(--accent-100)',
        }}
      >
        {description}
      </div>
    </div>
  );
};

const MemberPermissionsModal = ({ member, onClose }) => {
  const [permission, setPermission] = useState(member?.permission);

  const handleConfirm = async () => {
    try {
      await createPostRequest(`/api/user/permission/update`, {
        email: member.email,
        permission,
      });

      onClose();

      toast.success('User permissions updated successfully.');
    } catch (error) {
      if (error.response?.status === 400) {
        return toast.error(
          "You don't have permission to assign this permission."
        );
      }

      return toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <>
      <Modal.Title>Change Permissions</Modal.Title>
      <Modal.Message style={{ width: '475px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          <MemeberPermission
            title={'Admin'}
            description={
              'Members with this permission will have access to view monitors, manage monitors, and manage members.'
            }
            isActive={permission === 2}
            onClick={() => setPermission(2)}
          />
          <MemeberPermission
            title={'Editor'}
            description={
              'Members with this permission will have access to view monitors, and manage monitors.'
            }
            isActive={permission === 3}
            onClick={() => setPermission(3)}
          />
          <MemeberPermission
            title={'Guest'}
            description={
              'Members with this permission will only have access to view all montiors.'
            }
            isActive={permission === 4}
            onClick={() => setPermission(4)}
          />
        </div>
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

export default MemberPermissionsModal;
