import './avatar.scss';

// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'sonner';

// import local files
import Modal from '../../../ui/modal';
import TextInput from '../../../ui/input';

import { AlertError } from '../../../ui/alert';

const SettingsAccountDeleteModal = ({ closeModal, handleSumbit }) => {
  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>Delete Account</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <AlertError
          title="Warning"
          description="The following action is not reversible. Please be certain before you proceed."
        />

        <TextInput
          id="settings-transfer-confirm"
          label={
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
          have to data.
        </div>
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color="red" onClick={closeModal}>
          Cancel
        </Modal.Button>
        <Modal.Button
          color="green"
          onClick={() => {
            const transferConfirm = document.getElementById(
              'settings-transfer-confirm'
            ).value;

            if (transferConfirm.toLowerCase().trim() !== 'delete account') {
              toast.error('Enter delete account to confirm.');
              return;
            }

            handleSumbit();
          }}
        >
          Delete account
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

SettingsAccountDeleteModal.displayName = 'SettingsAccountDeleteModal';

SettingsAccountDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleSumbit: PropTypes.func.isRequired,
};

export default SettingsAccountDeleteModal;
