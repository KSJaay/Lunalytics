// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// import local files
import Modal from '../../../ui/modal';
import { createPostRequest } from '../../../../services/axios';
import { userPropType } from '../../../../../shared/utils/propTypes';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import SwitchWithText from '../../../ui/switch';

const permissionsWithDescription = [
  {
    permission: PermissionsBits.VIEW_MONITORS,
    title: 'View Monitors',
    description:
      'Tokens with this permission will be able to view all monitors.',
  },
  {
    permission: PermissionsBits.MANAGE_MONITORS,
    title: 'Manage Monitors',
    description:
      'Tokens with this permission will be able to create, edit and delete monitors.',
  },
  {
    permission: PermissionsBits.VIEW_NOTIFICATIONS,
    title: 'View Notifications',
    description:
      'Tokens with this permission will be able to view all notifications.',
  },
  {
    permission: PermissionsBits.MANAGE_NOTIFICATIONS,
    title: 'Manage Notifications',
    description:
      'Tokens with this permission will be able to create, edit and delete notifications.',
  },
  {
    permission: PermissionsBits.VIEW_STATUS_PAGES,
    title: 'View Status Pages',
    description:
      'Tokens with this permission will be able to view all status pages.',
  },
  {
    permission: PermissionsBits.MANAGE_STATUS_PAGES,
    title: 'Manage Status Pages',
    description:
      'Tokens with this permission will be able to create, edit and delete status pages.',
  },
  {
    permission: PermissionsBits.VIEW_INCIDENTS,
    title: 'View Incidents',
    description:
      'Tokens with this permission will be able to view all incidents.',
  },
  {
    permission: PermissionsBits.MANAGE_INCIDENTS,
    title: 'Manage Incidents',
    description:
      'Tokens with this permission will be able to create, edit and delete incidents.',
  },
  {
    permission: PermissionsBits.MANAGE_TEAM,
    title: 'Manage Team',
    description:
      'Tokens with this permission will be able to manage the team members.',
  },
  {
    permission: PermissionsBits.ADMINISTRATOR,
    title: 'Administrator',
    description:
      'Tokens with this permission will have every permission and will be able to bypass any restrictions.',
  },
];

const CreateInviteModal = ({ onClose }) => {
  const [perms, setPermission] = useState(tokenPermissions);

  const changePermission = (isChecked, permission) => {
    if (isChecked) {
      setPermission(perms | permission);
    } else {
      setPermission(perms & ~permission);
    }
  };

  const handleCreate = async () => {
    try {
      await createPostRequest('/api/invite/create', {});

      toast.success('Invite has been copied to clipboard.');
      onClose();
    } catch {
      toast.error('Error creating invite.');
    }
  };

  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>Invite user</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <div>
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
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={onClose}>Cancel</Modal.Button>
        <Modal.Button color="red" onClick={handleCreate}>
          Create
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

CreateInviteModal.displayName = 'CreateInviteModal';

CreateInviteModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateInviteModal;
