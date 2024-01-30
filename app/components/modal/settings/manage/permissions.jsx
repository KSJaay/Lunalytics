import './permissions.scss';

// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useState } from 'react';
import classNames from 'classnames';

// import local files
import { createPostRequest } from '../../../../services/axios';
import Modal from '../../../ui/modal';
import useTeamContext from '../../../../context/team';
import { userPropType } from '../../../../utils/propTypes';

const MemeberPermission = ({ title, description, isActive, ...props }) => {
  const containerClasses = classNames('permissions-container', {
    'permissions-container-active': isActive,
  });

  const titleClasses = classNames('permissions-title', {
    'permissions-title-active': isActive,
  });

  return (
    <div className={containerClasses} {...props}>
      <div className={titleClasses}>{title}</div>
      <div className="permissions-description">{description}</div>
    </div>
  );
};

const MemberPermissionsModal = ({ member, onClose }) => {
  const [permission, setPermission] = useState(member?.permission);
  const { updateUserPermission } = useTeamContext();

  const handleConfirm = async () => {
    try {
      await createPostRequest(`/api/user/permission/update`, {
        email: member.email,
        permission,
      });

      updateUserPermission(member.email, permission);

      toast.success('User permissions updated successfully.');
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        return toast.error(
          "You don't have permission to assign this permission."
        );
      }

      return toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <>
      <Modal.Title>Change Permissions</Modal.Title>
      <Modal.Message style={{ width: '475px' }}>
        <div className="member-permissions-message-container">
          <MemeberPermission
            title={'Admin'}
            description={
              'Members with this permission will have access to view monitors, manage monitors, and manage members.'
            }
            isActive={permission === 2}
            onClick={() => setPermission(2)}
          />
          <MemeberPermission
            title={'Editor'}
            description={
              'Members with this permission will have access to view monitors, and manage monitors.'
            }
            isActive={permission === 3}
            onClick={() => setPermission(3)}
          />
          <MemeberPermission
            title={'Guest'}
            description={
              'Members with this permission will only have access to view all montiors.'
            }
            isActive={permission === 4}
            onClick={() => setPermission(4)}
          />
        </div>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={onClose}>Cancel</Modal.Button>
        <Modal.Button color="green" onClick={handleConfirm}>
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

MemberPermissionsModal.displayName = 'MemberPermissionsModal';

MemberPermissionsModal.propTypes = {
  member: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

MemeberPermission.displayName = 'MemeberPermission';

MemeberPermission.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default MemberPermissionsModal;
