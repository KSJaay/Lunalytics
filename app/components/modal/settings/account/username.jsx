// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import Modal from '../../../ui/modal';
import { useState } from 'react';
import handleChangeUsername from '../../../../handlers/settings/account/username';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../../../context';

const SettingsAccountUsernameModal = ({
  title,
  modalTitle,
  id,
  value,
  closeModal,
}) => {
  const [error, setError] = useState(null);

  const {
    userStore: { updateUsingKey },
  } = useContextStore();

  const handleError = (error) => {
    setError(error);
  };

  const submit = async () => {
    const value = document.getElementById(`settings-edit-${id}`).value;
    const query = await handleChangeUsername(value, handleError, closeModal);

    if (query === true) {
      updateUsingKey('displayName', value);
    }
  };

  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>{modalTitle}</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <Input
          id={`settings-edit-${id}`}
          title={title}
          defaultValue={value}
          error={error}
        />
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color="red" onClick={closeModal}>
          Cancel
        </Modal.Button>
        <Modal.Button color="green" onClick={submit}>
          Update
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

SettingsAccountUsernameModal.displayName = 'SettingsAccountUsernameModal';

SettingsAccountUsernameModal.propTypes = {
  title: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default observer(SettingsAccountUsernameModal);
