import './avatar.scss';

// import dependencies
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

// import local files
import useContextStore from '../../../context';
import Button from '../../ui/button';
import SettingsAccountAvatarModal from '../../modal/settings/account/avatar';
import { createPostRequest } from '../../../services/axios';

const userPermissionNames = { 1: 'Owner', 2: 'Admin', 3: 'Editor', 4: 'Guest' };

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/gim) !== null;
};

const SettingsAccountAvatar = () => {
  const {
    userStore: {
      user: { avatar, displayName, permission },
      updateUsingKey,
    },
    modalStore: { openModal, closeModal },
  } = useContextStore();

  const avatarUrl = isImageUrl(avatar) ? avatar : `/icons/${avatar}.png`;

  const userAvatar = avatar ? (
    <img src={avatarUrl} className="settings-account-avatar-image" />
  ) : (
    <div className="settings-account-avatar-image-default">
      {displayName?.charAt(0)}
    </div>
  );

  const handleAvatarChange = async (selectedAvatar) => {
    try {
      await createPostRequest('/api/user/update/avatar', {
        avatar: selectedAvatar,
      });

      updateUsingKey('avatar', selectedAvatar);

      toast.success('Avatar successfully updated');
      closeModal();
    } catch {
      toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <div className="settings-account-avatar-container">
      {userAvatar}
      <div className="settings-account-avatar-info">
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            wordBreak: 'break-all',
          }}
        >
          {displayName}
        </div>
        <div style={{ fontSize: '18px' }}>
          {userPermissionNames[permission]}
        </div>
      </div>
      <div className="settings-account-avatar-button-container">
        <Button
          onClick={() =>
            openModal(
              <SettingsAccountAvatarModal
                closeModal={closeModal}
                value={avatar}
                handleSumbit={handleAvatarChange}
              />
            )
          }
        >
          Change avatar
        </Button>
        <Button onClick={() => handleAvatarChange(null)}>Delete avatar</Button>
      </div>
    </div>
  );
};

export default observer(SettingsAccountAvatar);
