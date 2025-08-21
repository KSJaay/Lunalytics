// import dependencies
import { useState } from 'react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import CreateInviteExpiry from './expiry';
import CreateInviteMaxUses from './maxUses';
import SwitchWithText from '../../../ui/switch';
import useClipboard from '../../../../hooks/useClipboard';
import useInvitesContext from '../../../../context/invites';
import useCurrentUrl from '../../../../hooks/useCurrentUrl';
import { createPostRequest } from '../../../../services/axios';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import { permissionsWithDescription } from '../../../../constant/permissions';

const CreateInviteModal = ({ closeModal }) => {
  const [perms, setPermission] = useState(0);
  const [maxUses, setMaxUses] = useState(null);
  const [expiryId, setExpiryId] = useState(null);
  const { addInvite } = useInvitesContext();
  const clipboard = useClipboard();
  const currentUrl = useCurrentUrl();

  const changePermission = (isChecked, permission) => {
    if (isChecked) {
      setPermission(perms | permission);
    } else {
      setPermission(perms & ~permission);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await createPostRequest('/api/invite/create', {
        expiry: expiryId,
        limit: maxUses,
        permission: perms,
      });

      const invite = response?.data?.invite;

      if (invite?.token) {
        await clipboard(
          `${currentUrl}/register/?invite=${invite.token}`,
          'Invite code has been copied to clipboard!'
        );
      } else {
        toast.success('Invite has been created successfully.');
      }

      addInvite(invite);
      closeModal();
    } catch (error) {
      if (error.response?.status === 400) {
        return toast.error(error.response.data.message);
      }

      toast.error('Error creating invite.');
    }
  };

  return (
    <Modal
      title="Create Invite"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={handleCreate}>
            Create
          </Button>
        </>
      }
      onClose={closeModal}
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <CreateInviteMaxUses setMaxUses={setMaxUses} maxUses={maxUses} />
        <CreateInviteExpiry expiryId={expiryId} setExpiryId={setExpiryId} />

        <div>
          <div className="input-label">Token Permissions</div>
          <div className="input-short-description">
            Permissions are used to restrict what the token can access.
          </div>
          <div className="settings-invite-permissions-container">
            {permissionsWithDescription.map((permission) => (
              <div key={permission.title}>
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

CreateInviteModal.displayName = 'CreateInviteModal';

export default observer(CreateInviteModal);
