// import dependencies
import PropTypes from 'prop-types';

// import local files
import SettingsTab from '../tab/desktop';
import SettingsAccount from '../../account';
import SettingsPersonalisation from '../../personalisation';
import ManageTeam from '../../manage';
import ManageApiTokens from '../../api';
import SettingsAbout from '../../about';
import { IoMdClose } from '../../../icons';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../../../context';
import Role from '../../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';

const SettingsDesktop = ({ tab, handleTabUpdate, handleKeydown }) => {
  const {
    userStore: { user },
  } = useContextStore();

  const role = new Role('user', user.permission);
  const isAdmin = role.hasPermission(PermissionsBits.ADMINISTRATOR);

  return (
    <>
      <div className="settings-close" onClick={() => handleKeydown(null, true)}>
        <IoMdClose style={{ width: '20px', height: '20px' }} />
      </div>
      <SettingsTab
        tab={tab}
        handleTabUpdate={handleTabUpdate}
        isAdmin={isAdmin}
      />
      {tab === 'Account' && <SettingsAccount />}
      {tab === 'Appearance' && <SettingsPersonalisation />}
      {isAdmin && tab === 'API Token' ? <ManageApiTokens /> : null}
      {tab === 'Manage Team' && <ManageTeam />}
      {tab === 'About' && <SettingsAbout />}
    </>
  );
};

SettingsDesktop.displayName = 'SettingsDesktop';

SettingsDesktop.propTypes = {
  tab: PropTypes.string.isRequired,
  handleTabUpdate: PropTypes.func.isRequired,
  handleKeydown: PropTypes.func.isRequired,
};

export default observer(SettingsDesktop);
