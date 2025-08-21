// import dependencies
import { observer } from 'mobx-react-lite';
import { IoMdClose } from 'react-icons/io';

// import local files
import ManageTeam from '../../manage';
import ManageApiTokens from '../../api';
import SettingsAbout from '../../about';
import ManageInvites from '../../invite';
import SettingsTab from '../tab/desktop';
import SettingsAccount from '../../account';
import useContextStore from '../../../../context';
import Role from '../../../../../shared/permissions/role';
import SettingsPersonalisation from '../../personalisation';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import SettingsAuthentication from '../../authentication';

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
      {isAdmin && tab === 'Authentication' ? <SettingsAuthentication /> : null}
      {isAdmin && tab === 'Invites' ? <ManageInvites /> : null}
      {tab === 'Manage Team' && <ManageTeam />}
      {tab === 'About' && <SettingsAbout />}
    </>
  );
};

SettingsDesktop.displayName = 'SettingsDesktop';

export default observer(SettingsDesktop);
