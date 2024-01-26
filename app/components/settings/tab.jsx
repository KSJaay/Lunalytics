import './tab.scss';

const tabs = [
  { name: 'general', text: 'General' },
  { name: 'manage', text: 'Manage Team' },
  { name: 'about', text: 'About' },
];

const SettingsTab = ({ tab, handleTabUpdate }) => {
  const tabsList = tabs.map(({ name, text }) => {
    const active = name === tab;
    return (
      <div
        key={name}
        className={`settings-tab-text ${active ? 'active' : ''}`}
        onClick={() => handleTabUpdate(name)}
      >
        {text}
      </div>
    );
  });

  return (
    <div className="settings-tab">
      <div className="settings-tab-title">Settings</div>
      {tabsList}
    </div>
  );
};

export default SettingsTab;
