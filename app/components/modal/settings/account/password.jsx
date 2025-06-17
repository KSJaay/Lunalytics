// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import Modal from '../../../ui/modal';
import RegisterChecklist from '../../../register/checklist';
import { IoMdEye, IoMdEyeOff } from '../../../icons';
import handleChangePassword from '../../../../handlers/settings/account/password';
import validators from '../../../../../shared/validators';

const SettingsAccountPasswordModal = ({ modalTitle, id, closeModal }) => {
  const [values, setValues] = useState({
    current: '',
    new: '',
    repeat: '',
    showPassword: false,
    showNewPassword: false,
    errors: {},
  });

  const handleOnBlur = (key, value) => {
    const isInvalidPassword = validators.auth.password(value);
    handleErrors(key, isInvalidPassword?.password || null);
  };

  const handlePasswordChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleErrors = (key, error) => {
    setValues((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [key]: error,
      },
    }));
  };

  const submit = async () => {
    const {
      current: currentPassword,
      new: newPassword,
      repeat: repeatPassword,
    } = values;

    await handleChangePassword({
      currentPassword,
      newPassword,
      repeatPassword,
      handleErrors,
      closeModal,
    });
  };

  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>{modalTitle}</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <Input
          id={`settings-current-password-${id}`}
          title="Current Password"
          value={values.current}
          onChange={(e) => handlePasswordChange('current', e.target.value)}
          onBlur={(e) => handleOnBlur('current', e.target.value)}
          type={values.showPassword ? 'text' : 'password'}
          iconRight={
            <div
              onClick={() =>
                handlePasswordChange('showPassword', !values.showPassword)
              }
            >
              {values.showPassword ? (
                <IoMdEyeOff style={{ width: '25px', height: '25px' }} />
              ) : (
                <IoMdEye style={{ width: '25px', height: '25px' }} />
              )}
            </div>
          }
          error={values.errors.current}
        />
        <Input
          id={`settings-new-password-${id}`}
          title="New Password"
          onChange={(e) => handlePasswordChange('new', e.target.value)}
          onBlur={(e) => handleOnBlur('new', e.target.value)}
          type={values.showNewPassword ? 'text' : 'password'}
          value={values.new}
          iconRight={
            <div
              onClick={() =>
                handlePasswordChange('showNewPassword', !values.showNewPassword)
              }
            >
              {values.showNewPassword ? (
                <IoMdEyeOff style={{ width: '25px', height: '25px' }} />
              ) : (
                <IoMdEye style={{ width: '25px', height: '25px' }} />
              )}
            </div>
          }
          error={values.errors.new}
        />

        <RegisterChecklist password={values.new} />

        <Input
          id={`settings-repeat-password-${id}`}
          title="Repeat New Password"
          onChange={(e) => handlePasswordChange('repeat', e.target.value)}
          onBlur={(e) => handleOnBlur('repeat', e.target.value)}
          type="password"
          value={values.repeat}
          error={values.errors.repeat}
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

SettingsAccountPasswordModal.displayName = 'SettingsAccountPasswordModal';

SettingsAccountPasswordModal.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default SettingsAccountPasswordModal;
