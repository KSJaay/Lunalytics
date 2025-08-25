// import dependencies
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, Modal } from '@lunalytics/ui';

// import local files
import SwitchWithText from '../../../ui/switch';
import useTokensContext from '../../../../context/tokens';
import { createPostRequest } from '../../../../services/axios';
import TokenValidator from '../../../../../shared/validators/token';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import { permissionsWithDescription } from '../../../../constant/permissions';

interface SettingsApiConfigureModalProps {
  closeModal: () => void;
  tokenId?: string;
  tokenName?: string;
  tokenPermissions?: number;
  isEdit?: boolean;
}

const SettingsApiConfigureModal = ({
  closeModal,
  tokenId = '',
  tokenName = '',
  tokenPermissions = 0,
  isEdit = false,
}: SettingsApiConfigureModalProps) => {
  const { addToken, updateTokenPermission } = useTokensContext();

  const [name, setName] = useState(tokenName);
  const [perms, setPermission] = useState(tokenPermissions);

  const changePermission = (isChecked: boolean, permission: number) => {
    if (isChecked) {
      setPermission(perms | permission);
    } else {
      setPermission(perms & ~permission);
    }
  };

  const handleEditOrCreateToken = async () => {
    try {
      const path = isEdit ? '/api/tokens/update' : '/api/tokens/create';

      const isInvalid = TokenValidator({
        name,
        token: tokenId,
        permission: perms,
        isEdit,
      });

      if (isInvalid) {
        return toast.error(isInvalid);
      }

      const response = await createPostRequest(path, {
        name,
        token: tokenId,
        permission: perms,
      });

      const data = response?.data || {};

      if (isEdit) {
        updateTokenPermission(data.token, data.permission, data.name);
      } else {
        addToken(data);
      }

      const message = isEdit
        ? 'Token has been updated successfully'
        : 'Token has been created successfully';

      toast.success(message);

      closeModal();
    } catch (error: any) {
      if (error.response?.status === 401) {
        closeModal();
        return;
      }

      toast.error(
        `Error occured while ${isEdit ? 'editing' : 'creating'} token`
      );
      closeModal();
    }
  };

  return (
    <Modal
      title={isEdit ? 'Update API Token' : 'Create API Token'}
      actions={
        <>
          <Button
            color="red"
            variant="flat"
            id="manage-close-button"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            color="green"
            variant="flat"
            id="manage-create-button"
            onClick={handleEditOrCreateToken}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </>
      }
      onClose={closeModal}
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input
          title="Token Name"
          id="name"
          type="text"
          placeholder="Lunalytics"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
          value={name}
          subtitle="This will be automatically generated if one is not provided."
        />

        <div>
          <div className="input-label">Token Permissions</div>
          <div className="input-short-description">
            Permissions are used to restrict what the token can access.
          </div>
          <div
            style={{
              gap: '10px',
              display: 'flex',
              flexDirection: 'column',
              padding: '15px 0 20px 0',
            }}
          >
            {permissionsWithDescription.map((permission) => (
              <div
                key={permission.title}
                style={{
                  borderBottom: '1px solid var(--accent-700)',
                  paddingBottom: '10px',
                }}
              >
                <SwitchWithText
                  key={permission.title}
                  label={permission.title}
                  shortDescription={permission.description}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    changePermission(
                      event.target.checked,
                      permission.permission
                    )
                  }
                  checked={
                    perms & permission.permission ||
                    perms === PermissionsBits.ADMINISTRATOR ||
                    perms & PermissionsBits.ADMINISTRATOR
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

SettingsApiConfigureModal.displayName = 'SettingsApiConfigureModal';

export default SettingsApiConfigureModal;
