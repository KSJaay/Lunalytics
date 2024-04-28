// import styles
import './avatar.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/gim) !== null;
};

const Avatar = ({ showUsername = true, showAvatar = true }) => {
  const {
    userStore: {
      user: { avatar, displayName },
    },
  } = useContextStore();

  const avatarUrl = isImageUrl(avatar) ? avatar : `/icons/${avatar}.png`;

  const userAvatar = avatar ? (
    <img src={avatarUrl} className="avatar" />
  ) : (
    <div className="avatar-default">{displayName?.charAt(0)}</div>
  );

  return (
    <div className="avatar-container">
      {showAvatar && userAvatar}
      {showUsername && <div className="avatar-username">{displayName}</div>}
    </div>
  );
};

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  showUsername: PropTypes.bool,
  showAvatar: PropTypes.bool,
};

export default observer(Avatar);
