import './tab.scss';
import './general.scss';

const SettingsGeneral = () => {
  return (
    <div className="settings-general-container">
      <div className="settings-tab-title">Settings</div>

      <div className="settings-general-content">
        <div className="settings-general-profile">
          <div className="settings-general-title">Profile Information</div>
          <div className="settings-general-subtitle">
            Configure timezone and date format display settings
          </div>
          <div>Username</div>
          <div>Avatar</div>
          <div>Email</div>
          <div>Theme</div>
          <div>Color</div>
        </div>
        <div className="settings-general-date">
          <div className="settings-general-title">Date & Time</div>
          <div className="settings-general-subtitle">
            Configure profile information and appearance
          </div>
          <div>Timezone</div>
          <div>Date Format</div>
          <div>Time Format</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsGeneral;
