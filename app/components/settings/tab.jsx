import './tab.scss';

const SettingsTab = () => {
  return (
    <div className="settings-tab">
      <div className="settings-tab-title">Settings</div>
      <div className="settings-tab-text active">General</div>
      <div className="settings-tab-text">About</div>
    </div>
  );
};

export default SettingsTab;
