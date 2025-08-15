import './avatar.scss';

// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Input, Modal } from '@lunalytics/ui';

// import local files
import { createPostRequest } from '../../../../services/axios';

const SettingsAccountDeleteModal = ({ closeModal }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const transferConfirm = document.getElementById(
        'settings-transfer-confirm'
      ).value;

      if (transferConfirm.toLowerCase().trim() !== 'delete account') {
        toast.error('Enter delete account to confirm.');
        return;
      }

      const query = await createPostRequest('/api/user/delete/account');

      if (query.status === 200) {
        toast.success('Account as been deleted!');
        closeModal();
        return navigate('/login');
      }

      toast.error('Something went wrong, please try again later.');
    } catch (error) {
      if (error.response?.status === 403) {
        return toast.error(error.response.data);
      }

      toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <Modal
      title="Delete Account"
      actions={
        <>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="red" variant="flat" onClick={handleDeleteAccount}>
            Delete account
          </Button>
        </>
      }
      size="xs"
    >
      <Alert
        status="error"
        title="Warning"
        description="The following action is not reversible. Please be certain before you proceed."
      />

      <Input
        id="settings-transfer-confirm"
        title={
          <div style={{ fontWeight: '500', fontSize: '14px' }}>
            To verify, type{' '}
            <span style={{ fontWeight: '800' }}>delete account</span> below:
          </div>
        }
      />

      <div
        style={{
          fontWeight: '500',
          fontSize: '15px',
          color: 'var(--red-700)',
          marginTop: '15px',
        }}
      >
        By continuing, your account will be deleted, along with any access you
        have to Lunalytics.
      </div>
    </Modal>
  );
};

SettingsAccountDeleteModal.displayName = 'SettingsAccountDeleteModal';

SettingsAccountDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default SettingsAccountDeleteModal;
