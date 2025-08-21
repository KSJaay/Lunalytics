import './avatar.scss';

// import dependencies
import { useState } from 'react';
import { Button, Input, Modal } from '@lunalytics/ui';

const avatars = [
  'Ape',
  'Bear',
  'Cat',
  'Dog',
  'Duck',
  'Eagle',
  'Fox',
  'Gerbil',
  'Hamster',
  'Hedgehog',
  'Koala',
  'Ostrich',
  'Panda',
  'Rabbit',
  'Rocket',
  'Smart-Dog',
  'Tiger',
];

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }

  return url.match(/^https?:\/\//gim);
};

const SettingsAccountAvatarModal = ({
  value = 'Panda',
  closeModal,
  handleSumbit,
}) => {
  const [avatar, setAvatar] = useState(value);

  const isUrl = isImageUrl(avatar);
  const imageUrl = isUrl ? avatar : `/icons/${avatar}.png`;

  return (
    <Modal
      title="Change Avatar"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            onClick={() => handleSumbit(avatar)}
          >
            Update
          </Button>
        </>
      }
    >
      <div className="settings-modal-avatar-container">
        <img src={imageUrl} className="settings-modal-avatar-image" />
      </div>
      <Input
        title="Input Avatar URL"
        value={isUrl ? avatar : ''}
        onChange={(e) => setAvatar(e.target.value)}
      />

      <div className="input-label">Or select from below</div>
      <div className="settings-modal-avatars-container">
        {avatars.map((avatarName) => (
          <img
            key={avatarName}
            src={`/icons/${avatarName}.png`}
            className={
              avatarName === avatar
                ? 'settings-modal-avatar-option-select'
                : 'settings-modal-avatar-option'
            }
            alt={avatarName}
            onClick={() => setAvatar(avatarName)}
          />
        ))}
      </div>
    </Modal>
  );
};

SettingsAccountAvatarModal.displayName = 'SettingsAccountAvatarModal';

export default SettingsAccountAvatarModal;
