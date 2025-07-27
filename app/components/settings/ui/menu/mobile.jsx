// import dependencies
import PropTypes from 'prop-types';
import { useState } from 'react';

// import local files
import { IoArrowBack } from '../../../icons';
import SettingsMobileTabs from '../tab/mobile';
import SettingsAccount from '../../account';
import SettingsPersonalisation from '../../personalisation';
import ManageApiTokens from '../../api';
import ManageTeam from '../../manage';
import SettingsAbout from '../../about';
import { observer } from 'mobx-react-lite';
import Role from '../../../../../shared/permissions/role';
import useContextStore from '../../../../context';
import { PermissionsBits } from '../../../../../shared/permissions/bitFlags';
import ManageInvites from '../../invite';

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

SettingsMobile.propTypes = {
  handleKeydown: PropTypes.func.isRequired,
};

export default observer(SettingsMobile);
