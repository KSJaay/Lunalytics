import './settings.scss';
import React from 'react';
import SettingsTab from '../components/settings/tab';
import SettingsGeneral from '../components/settings/general';

const Settings = () => {
  return (
    <div className="settings-content">
      <SettingsTab />
      <SettingsGeneral />
    </div>
  );
};

export default Settings;
