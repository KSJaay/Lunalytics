// import dependencies
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IoArrowBack } from 'react-icons/io5';

// import local files
import ManageTeam from '../../manage';
import SettingsAbout from '../../about';
import ManageApiTokens from '../../api';
import ManageInvites from '../../invite';
import SettingsAccount from '../../account';
import SettingsMobileTabs from '../tab/mobile';
import useContextStore from '../../../../context';
import Role from '../../../../../shared/permissions/role';
import SettingsPersonalisation from '../../personalisation';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';

const SettingsMobile = ({ handleKeydown }) => {
  const {
    userStore: { user },
  } = useContextStore();

  const [page, setPage] = useState('homepage');
  const handleTabChange = (page) => setPage(page);

  const role = new Role('user', user.permission);
  const isAdmin = role.hasPermission(PermissionsBits.ADMINISTRATOR);

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div style={{ display: 'flex', margin: '16px 0 8px 0', gap: '4px' }}>
        <div
          className="settings-back-button"
          onClick={() => {
            if (page === 'homepage') {
              return handleKeydown(null, true);
            }

            setPage('homepage');
          }}
        >
          <IoArrowBack style={{ width: '30px', height: '30px' }} />
        </div>
        <div
          style={{
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--font-color)',
            fontSize: 'var(--font-3xl)',
          }}
        >
          Settings
        </div>
      </div>

      {page === 'homepage' && (
        <SettingsMobileTabs
          handleTabChange={handleTabChange}
          isAdmin={isAdmin}
        />
      )}
      {page === 'Account' && <SettingsAccount />}
      {page === 'Appearance' && <SettingsPersonalisation />}
      {isAdmin && page === 'API Token' && <ManageApiTokens />}
      {isAdmin && page === 'Invites' && <ManageInvites />}
      {page === 'Manage Team' && <ManageTeam />}
      {page === 'About' && <SettingsAbout />}
    </div>
  );
};

SettingsMobile.displayName = 'SettingsMobile';

export default observer(SettingsMobile);
