import { Button, Modal } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import useModalContext from '../../../../context/modal';

const SettingsLogout = observer(() => {
  const { closeModal } = useModalContext();

  const handleLogout = () => (window.location.href = '/api/auth/logout');

  return (
    <Modal
      title="Log Out"
      size="xs"
      actions={
        <>
          <Button
            id="settings-logout-modal-cancel-button"
            color="green"
            variant="flat"
            onClick={() => {
              console.log('Hello there sir');
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            id="settings-logout-modal-confirm-button"
            color="red"
            variant="flat"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </>
      }
      onClose={closeModal}
    >
      <div>
        Are you sure you want to log out?
        <br />
        You will need to log in again to continue.
      </div>
    </Modal>
  );
});

export default SettingsLogout;
