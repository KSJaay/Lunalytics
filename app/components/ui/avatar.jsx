// import styles
import './avatar.scss';

// import dependencies
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

// import local files
import ContextStore from '../../context';

const Avatar = ({ showUsername = true, showAvatar = true }) => {
  const {
    userStore: { user },
  } = useContext(ContextStore);

  return (
    <div className="avatar-container">
      {showAvatar && (
        <img src={`/icons/${user.avatar || 'Panda'}.png`} className="avatar" />
      )}
      {showUsername && (
        <div className="avatar-username">{user.displayName}</div>
      )}
    </div>
  );
};

export default observer(Avatar);
