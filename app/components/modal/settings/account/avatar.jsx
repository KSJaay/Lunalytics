import './avatar.scss';

// import dependencies
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Input } from '@lunalytics/ui';

// import local files
import Modal from '../../../ui/modal';

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
    <>
      <Modal.Title style={{ textAlign: 'center' }}>Change Avatar</Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
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
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color="red" onClick={closeModal}>
          Cancel
        </Modal.Button>
        <Modal.Button color="green" onClick={() => handleSumbit(avatar)}>
          Update
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

SettingsAccountAvatarModal.displayName = 'SettingsAccountAvatarModal';

SettingsAccountAvatarModal.propTypes = {
  value: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSumbit: PropTypes.func.isRequired,
};

export default SettingsAccountAvatarModal;
