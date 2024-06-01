import './settings.scss';

// import dependencies
import { useEffect, useState } from 'react';

// import local files
import useGoBack from '../hooks/useGoBack';
// import SettingsMobile from '../components/settings/ui/menu/mobile';
import SetttingsDesktop from '../components/settings/ui/menu/desktop';
import SettingsMobile from '../components/settings/ui/menu/mobile';

const Settings = () => {
  const [tab, setTab] = useState('Account');
  const handleTabUpdate = (tab) => {
    return setTab(tab);
  };
  const goBack = useGoBack();

  const handleKeydown = (event, isHandler = false) => {
    if (event?.key === 'Escape' || event?.key === 'Esc' || isHandler) {
      goBack();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

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
