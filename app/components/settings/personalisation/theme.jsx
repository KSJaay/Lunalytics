// import dependencies
import PropTypes from 'prop-types';

// import local files
import FaCircleCheck from '../../icons/faCircleCheck';
import Tooltip from '../../ui/tooltip';
import { LiaSyncSolid } from '../../icons';

const SettingsPersonalisationTheme = ({ theme, setTheme }) => {
  return (
    <>
      <div className="settings-subtitle">Theme</div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Tooltip text="Light">
          <div
            className={
              theme === 'light'
                ? 'settings-theme settings-theme--active settings-theme-light'
                : 'settings-theme settings-theme-light'
            }
            onClick={() => setTheme('light')}
          >
            {theme === 'light' && (
              <div className="settings-theme-icon">
                <FaCircleCheck width={24} height={24} />
              </div>
            )}
          </div>
        </Tooltip>
        <Tooltip text="Dark">
          <div
            className={
              theme === 'dark'
                ? 'settings-theme settings-theme--active settings-theme-dark'
                : 'settings-theme settings-theme-dark'
            }
            onClick={() => setTheme('dark')}
          >
            {theme === 'dark' && (
              <div className="settings-theme-icon">
                <FaCircleCheck width={24} height={24} />
              </div>
            )}
          </div>
        </Tooltip>
        <Tooltip text="Sync with system">
          <div
            className={
              theme === 'system'
                ? 'settings-theme settings-theme--active'
                : 'settings-theme'
            }
            onClick={() => setTheme('system')}
          >
            {theme === 'system' && (
              <div className="settings-theme-icon">
                <FaCircleCheck width={24} height={24} />
              </div>
            )}
            <div style={{ position: 'absolute', top: '20%', left: '20%' }}>
              <LiaSyncSolid width={36} height={36} />
            </div>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

SettingsPersonalisationTheme.displayName = 'SettingsPersonalisationTheme';

SettingsPersonalisationTheme.propTypes = {
  theme: PropTypes.string.isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default SettingsPersonalisationTheme;
