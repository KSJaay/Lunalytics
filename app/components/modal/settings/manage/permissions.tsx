// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import SwitchWithText from '../../../ui/switch';
import useContextStore from '../../../../context';
import useTeamContext from '../../../../context/team';
import { createPostRequest } from '../../../../services/axios';
import { userPropType } from '../../../../../shared/utils/propTypes';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import { permissionsWithDescription } from '../../../../constant/permissions';

const MemberPermissionsModal = ({ member, onClose }) => {
  const [perms, setPermission] = useState(member?.permission);
  const { updateUserPermission } = useTeamContext();
  const {
    userStore: { hasPermission },
  } = useContextStore();

  const handleConfirm = async () => {
    try {
      await createPostRequest(`/api/user/permission/update`, {
        email: member.email,
        permission: perms,
      });

      updateUserPermission(member.email, perms);

      toast.success('User permissions updated successfully.');
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data.message) {
          return toast.error(error.response.data.message);
        }

        return toast.error(
          "You don't have permission to assign this permission."
        );
      }

      return toast.error('Something went wrong, please try again later.');
    }
  };

  const changePermission = (isChecked, permission) => {
    if (isChecked) {
      setPermission(perms | permission);
    } else {
      setPermission(perms & ~permission);
    }
  };

  return (
    <Modal
      title="Change Permissions"
      actions={
        <>
          <Button color="red" variant="flat" onClick={onClose}>
            Cancel
          </Button>
          <Button color="green" variant="flat" onClick={handleConfirm}>
            Confirm
          </Button>
        </>
      }
      onClose={onClose}
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div className="input-label">User Permissions</div>
          <div className="input-short-description">
            Permissions are used to restrict what the user can access.
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
                  onChange={(event) =>
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
                  disabled={!hasPermission(permission.permission)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

MemberPermissionsModal.displayName = 'MemberPermissionsModal';

MemberPermissionsModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default observer(MemberPermissionsModal);
