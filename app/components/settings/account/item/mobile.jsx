import './mobile.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import { FaChevronRight } from '../../../icons';
import useContextStore from '../../../../context';
import SettingsAccountAvatarModal from '../../../modal/settings/account/avatar';
import SettingsAccountDeleteModal from '../../../modal/settings/account/delete';
import SettingsAccountPasswordModal from '../../../modal/settings/account/password';
import SettingsAccountTransferModal from '../../../modal/settings/account/transfer';
import SettingsAccountEditModal from '../../../modal/settings/account/username';

const selectModal = (id, props, closeModal) => {
  switch (id) {
    case 'displayName':
      return <SettingsAccountEditModal closeModal={closeModal} {...props} />;
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

const SettingsAccountMobileItem = ({
  title,
  id,
  canEdit,
  fontColor,
  permissionLevel,
  ...props
}) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
  } = useContextStore();

  if (permissionLevel && permissionLevel < user.permission) {
    return null;
  }

  const color = !fontColor ? {} : { color: `var(--${fontColor}-700)` };

  return (
    <div
      className="settings-account-mobile-item"
      onClick={() => {
        const content = selectModal(
          id,
          { title, id, canEdit, fontColor, value: user[id], ...props },
          closeModal
        );

        if (!content) {
          return;
        }

        openModal(content);
      }}
    >
      <div className="settings-account-mobile-item-title" style={color}>
        {title}
      </div>
      <div className="settings-account-mobile-item-description">
        <div style={{ color: 'var(--accent-200)' }}>{user[id]}</div>

        {canEdit && (
          <div className="settings-account-mobile-item-icon">
            <FaChevronRight style={{ width: '25px', height: '25px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

SettingsAccountMobileItem.displayName = 'SettingsAccountMobileItem';

SettingsAccountMobileItem.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  fontColor: PropTypes.string,
  permissionLevel: PropTypes.number,
};

export default observer(SettingsAccountMobileItem);
