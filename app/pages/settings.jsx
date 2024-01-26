import './settings.scss';
import { useState } from 'react';
import SettingsTab from '../components/settings/tab';
import SettingsGeneral from '../components/settings/general';
import SettingsAbout from '../components/settings/about';
import ManageTeam from '../components/settings/manage';

const Settings = () => {
  const [tab, setTab] = useState('general');
  const handleTabUpdate = (tab) => setTab(tab);

  return (
    <div className="settings-content">
      <SettingsTab tab={tab} handleTabUpdate={handleTabUpdate} />
      {tab === 'general' && <SettingsGeneral />}
      {tab === 'about' && <SettingsAbout />}
      {tab === 'manage' && <ManageTeam />}
    </div>
  );
};

export default Settings;
