import './settings.scss';
import { useState } from 'react';
import SettingsTab from '../components/settings/tab';
import SettingsGeneral from '../components/settings/general';
import SettingsAbout from '../components/settings/about';

const Settings = () => {
  const [tab, setTab] = useState('general');
  const handleTabUpdate = (tab) => setTab(tab);

  return (
    <div className="settings-content">
      <SettingsTab tab={tab} handleTabUpdate={handleTabUpdate} />
      {tab === 'general' && <SettingsGeneral />}
      {tab === 'about' && <SettingsAbout />}
    </div>
  );
};

export default Settings;
