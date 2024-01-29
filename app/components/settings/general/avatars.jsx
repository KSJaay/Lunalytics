import './avatars.scss';

// import dependencies
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';

// import local files
import Modal from '../../ui/modal';
import useContextStore from '../../../context';
import { createPostRequest } from '../../../services/axios';
import { userPropType } from '../../../utils/propTypes';

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

const ModalAvatarSelect = ({ user, onClose, handleSumbit }) => {
  const [avatarIndex, setAvatarIndex] = useState(0);

  useEffect(() => {
    const index = avatars.indexOf(user?.avatar);

    if (index === -1) {
      setAvatarIndex(0);
    } else {
      setAvatarIndex(index);
    }
  }, []);

  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>
        Select your avatar
      </Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <div className="modal-avatar-container">
          <img
            src={`/icons/${avatars[avatarIndex]}.png`}
            className="modal-avatar-image"
          />
        </div>
        <div className="modal-avatar-options-container">
          <div
            className="modal-avatar-option"
            onClick={() => {
              if (avatarIndex === 0) {
                return setAvatarIndex(avatars.length - 1);
              }

              return setAvatarIndex(avatarIndex - 1);
            }}
          >
            Prev
          </div>
          <div className="modal-avatar-name">{avatars[avatarIndex]}</div>
          <div
            className="modal-avatar-option"
            onClick={() => {
              if (avatarIndex === avatars.length - 1) {
                return setAvatarIndex(0);
              }

              return setAvatarIndex(avatarIndex + 1);
            }}
          >
            Next
          </div>
        </div>
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color="red" onClick={onClose}>
          Cancel
        </Modal.Button>
        <Modal.Button
          color="green"
          onClick={() => handleSumbit(avatars[avatarIndex])}
        >
          Update
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

const AvatarSelect = () => {
  const {
    modalStore: { openModal, closeModal },
    userStore: { user, setUser },
  } = useContextStore();

  const handleSumbit = async (avatar) => {
    if (user.avatar !== avatar) {
      await createPostRequest('/api/user/update/avatar', {
        avatar,
      });

      setUser({ ...user, avatar });
    }

    toast.success('Avatar updated successfully');
    closeModal();
  };

  return (
    <>
      <label className="text-input-label">Avatar</label>
      <div
        className="avatar-input"
        onClick={() =>
          openModal(
            <ModalAvatarSelect
              user={user}
              onClose={closeModal}
              handleSumbit={handleSumbit}
            />,
            false
          )
        }
      >
        {user.avatar}
      </div>
    </>
  );
};

AvatarSelect.displayName = 'AvatarSelect';

ModalAvatarSelect.propTypes = {
  user: userPropType.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSumbit: PropTypes.func.isRequired,
};

export default observer(AvatarSelect);
