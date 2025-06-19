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

const SettingsDesktop = ({ tab, handleTabUpdate, handleKeydown }) => {
  return (
    <>
      <div className="settings-close" onClick={() => handleKeydown(null, true)}>
        <IoMdClose style={{ width: '20px', height: '20px' }} />
      </div>
      <SettingsTab tab={tab} handleTabUpdate={handleTabUpdate} />
      {tab === 'Account' && <SettingsAccount />}
      {tab === 'Appearance' && <SettingsPersonalisation />}
      {tab === 'API Token' && <ManageApiTokens />}
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

export default SettingsDesktop;
