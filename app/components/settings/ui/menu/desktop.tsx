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
import SettingsPersonalisation from '../../personalisation';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import SettingsAuthentication from '../../authentication';
import useMemberContext from '../../../../context/member';

const SettingsDesktop = ({ tab, handleTabUpdate, handleKeydown }) => {
  const { member } = useMemberContext();

  const isAdmin = member?.role.hasPermission(PermissionsBits.ADMINISTRATOR);

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
