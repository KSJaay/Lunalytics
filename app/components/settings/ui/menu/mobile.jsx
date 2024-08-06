// import dependencies
import PropTypes from 'prop-types';
import { useState } from 'react';

// import local files
import { IoArrowBack } from '../../../icons';
import SettingsMobileTabs from '../tab/mobile';
import SettingsAccount from '../../account';
import SettingsPersonalisation from '../../personalisation';
import ManageTeam from '../../manage';
import SettingsAbout from '../../about';

const SettingsMobile = ({ handleKeydown }) => {
  const [page, setPage] = useState('homepage');
  const handleTabChange = (page) => setPage(page);

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
        <SettingsMobileTabs handleTabChange={handleTabChange} />
      )}
      {page === 'Account' && <SettingsAccount />}
      {page === 'Appearance' && <SettingsPersonalisation />}
      {page === 'Manage Team' && <ManageTeam />}
      {page === 'About' && <SettingsAbout />}
    </div>
  );
};

SettingsMobile.displayName = 'SettingsMobile';

SettingsMobile.propTypes = {
  handleKeydown: PropTypes.func.isRequired,
};

export default SettingsMobile;
