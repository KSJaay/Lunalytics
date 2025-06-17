// import dependencies
import PropTypes from 'prop-types';
import { Tooltip } from '@lunalytics/ui';

// import local files
import { FaCircleCheck, LiaSyncSolid } from '../../icons';

const SettingsPersonalisationTheme = ({ theme, setTheme }) => {
  return (
    <>
      <div className="settings-subtitle">Theme</div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Tooltip text="Light" color="gray">
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
                <FaCircleCheck style={{ width: '24px', height: '24px' }} />
              </div>
            )}
          </div>
        </Tooltip>
        <Tooltip text="Dark" color="gray">
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
                <FaCircleCheck style={{ width: '24px', height: '24px' }} />
              </div>
            )}
          </div>
        </Tooltip>
        <Tooltip text="Sync with system" color="gray">
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
                <FaCircleCheck style={{ width: '24px', height: '24px' }} />
              </div>
            )}
            <div style={{ position: 'absolute', top: '20%', left: '20%' }}>
              <LiaSyncSolid style={{ width: '36px', height: '36px' }} />
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
