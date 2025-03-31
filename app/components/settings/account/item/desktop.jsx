import './desktop.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import local files
import Button from '../../../ui/button';
import useContextStore from '../../../../context';

import SettingsAccountAvatarModal from '../../../modal/settings/account/avatar';
import SettingsAccountDeleteModal from '../../../modal/settings/account/delete';
import SettingsAccountPasswordModal from '../../../modal/settings/account/password';
import SettingsAccountTransferModal from '../../../modal/settings/account/transfer';
import SettingsAccountUsernameModal from '../../../modal/settings/account/username';

const selectModal = (id, props, closeModal) => {
  switch (id) {
    case 'displayName':
      return (
        <SettingsAccountUsernameModal closeModal={closeModal} {...props} />
      );
    case 'password':
      return (
        <SettingsAccountPasswordModal closeModal={closeModal} {...props} />
      );
    case 'avatar':
      return <SettingsAccountAvatarModal closeModal={closeModal} {...props} />;
    case 'transfer':
      return (
        <SettingsAccountTransferModal closeModal={closeModal} {...props} />
      );
    case 'delete':
      return <SettingsAccountDeleteModal closeModal={closeModal} {...props} />;
    default:
      return null;
  }
};

const SettingsAccountDesktopItem = ({
  title,
  id,
  canEdit,
  description,
  customButton,
  ownerOnly,
  ...props
}) => {
  const classes = classNames({
    'settings-account-item': !description,
    'settings-account-item-vertical': description,
  });

  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
  } = useContextStore();

  if (ownerOnly && !user.isOwner) return null;

  return (
    <div className={classes}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="settings-account-item-title">{title}</div>
        {!description && (
          <div className="settings-account-item-info">
            {id === 'password' ? '* * * * * * * *' : user[id]}
          </div>
        )}
        {description && (
          <div className="settings-account-item-description">{description}</div>
        )}
      </div>
      <span
        onClick={() => {
          const content = selectModal(
            id,
            { title, id, canEdit, value: user[id], ...props },
            closeModal
          );

          if (!content) {
            return;
          }

          openModal(content);
        }}
      >
        {canEdit && !customButton && (
          <div className="settings-account-item-button">
            <Button color="gray">Edit</Button>
          </div>
        )}
        {customButton ? customButton : null}
      </span>
    </div>
  );
};

SettingsAccountDesktopItem.displayName = 'SettingsAccountDesktopItem';

SettingsAccountDesktopItem.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  description: PropTypes.string,
  customButton: PropTypes.element,
  permissionLevel: PropTypes.number,
};

export default observer(SettingsAccountDesktopItem);
