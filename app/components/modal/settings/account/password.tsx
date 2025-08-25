// import dependencies
import { useState } from 'react';
import { Button, Input, Modal } from '@lunalytics/ui';

// import local files
import { IoMdEye, IoMdEyeOff } from '../../../icons';
import RegisterChecklist from '../../../register/checklist';
import validators from '../../../../../shared/validators';
import handleChangePassword from '../../../../handlers/settings/account/password';

interface SettingsAccountPasswordModalProps {
  modalTitle: string;
  id: string;
  closeModal: () => void;
}

interface PasswordErrors {
  current?: string;
  new?: string;
  repeat?: string;
}

const SettingsAccountPasswordModal = ({
  modalTitle,
  id,
  closeModal,
}: SettingsAccountPasswordModalProps) => {
  const [values, setValues] = useState<{
    current: string;
    new: string;
    repeat: string;
    showPassword: boolean;
    showNewPassword: boolean;
    errors: PasswordErrors;
  }>({
    current: '',
    new: '',
    repeat: '',
    showPassword: false,
    showNewPassword: false,
    errors: {},
  });

  const handleOnBlur = (key: string, value: any) => {
    const isInvalidPassword = validators.auth.password(value);

    if (isInvalidPassword && isInvalidPassword.password) {
      handleErrors(key, isInvalidPassword.password || null);
    }
  };

  const handlePasswordChange = (key: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleErrors = (key: string, error: any) => {
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
        id={`settings-current-password-${id}`}
        title="Current Password"
        value={values.current}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePasswordChange('current', e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
          handleOnBlur('current', e.target.value)
        }
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePasswordChange('new', e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
          handleOnBlur('new', e.target.value)
        }
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePasswordChange('repeat', e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
          handleOnBlur('repeat', e.target.value)
        }
        type="password"
        value={values.repeat}
        error={values.errors.repeat}
      />
    </Modal>
  );
};

SettingsAccountPasswordModal.displayName = 'SettingsAccountPasswordModal';

export default SettingsAccountPasswordModal;
