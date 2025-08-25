// import dependencies
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input, Modal } from '@lunalytics/ui';

// import local files
import useContextStore from '../../../../context';
import handleChangeUsername from '../../../../handlers/settings/account/username';

interface SettingsAccountUsernameModalProps {
  title: string;
  modalTitle: string;
  id: string;
  value: string;
  closeModal: () => void;
}

const SettingsAccountUsernameModal = ({
  title,
  modalTitle,
  id,
  value,
  closeModal,
}: SettingsAccountUsernameModalProps) => {
  const [error, setError] = useState<string | null>(null);

  const {
    userStore: { updateUsingKey },
  } = useContextStore();

  const handleError = (error: string) => {
    setError(error);
  };

  const submit = async () => {
    const inputElement = document.getElementById(
      `settings-edit-${id}`
    ) as HTMLInputElement | null;

    if (!inputElement) {
      setError('Error finding user input.');
      return;
    }
    const value = inputElement.value;
    const query = await handleChangeUsername(value, handleError, closeModal);

    if (query === true) {
      updateUsingKey('displayName', value);
    }
  };

  return (
    <Modal
      title={modalTitle}
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={submit}>
            Update
          </Button>
        </>
      }
      onClose={closeModal}
      size="xs"
    >
      <Input
        id={`settings-edit-${id}`}
        title={title}
        defaultValue={value}
        error={error}
      />
    </Modal>
  );
};

SettingsAccountUsernameModal.displayName = 'SettingsAccountUsernameModal';

export default observer(SettingsAccountUsernameModal);
