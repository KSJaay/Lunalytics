import '../styles/pages/settings.scss';

// import dependencies
import { useEffect, useState } from 'react';

// import local files
import useGoBack from '../hooks/useGoBack';
import SetttingsDesktop from '../components/settings/ui/menu/desktop';
import SettingsMobile from '../components/settings/ui/menu/mobile';
import type { SettingsTabNames } from '../components/settings/ui/tab/desktop';

const Settings = () => {
  const [tab, setTab] = useState<SettingsTabNames>('Account');
  const handleTabUpdate = (tab: SettingsTabNames) => {
    return setTab(tab);
  };
  const goBack = useGoBack();

  const handleKeydown = (event: KeyboardEvent | null, isHandler = false) => {
    if (event?.key === 'Escape' || event?.key === 'Esc' || isHandler) {
      goBack();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <>
      <div className="settings-container mobile-hidden">
        <SetttingsDesktop
          tab={tab}
          handleTabUpdate={handleTabUpdate}
          handleKeydown={handleKeydown}
        />
      </div>
      <div className="settings-container mobile-shown">
        <SettingsMobile handleKeydown={handleKeydown} />
      </div>
    </>
  );
};

export default Settings;
