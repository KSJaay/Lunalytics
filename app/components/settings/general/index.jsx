// import styles
import '../tab.scss';
import './style.scss';

// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import TextInput from '../../ui/input';
import { createPostRequest } from '../../../services/axios';
import {
  TimezoneDropdown,
  DateformatDropdown,
  TimeformatDropdown,
  ColorsDropdown,
  ThemesDropdown,
} from './dropdown';
import AvatarSelect from './avatars';
import useContextStore from '../../../context';

const SettingsGeneral = () => {
  const {
    userStore: { user, setUser },
  } = useContextStore();

  const handleUpdate = async (e) => {
    const value = e.target?.value?.trim();

    if (!value) {
      return;
    }

    if (user.displayName !== value) {
      await createPostRequest('/api/user/update/username', {
        displayName: value,
      });

      setUser({ ...user, displayName: value });

      return;
    }
  };

  return (
    <div className="settings-general-container">
      <div className="settings-tab-title">General</div>

      <div className="settings-general-content">
        <div className="settings-general-profile">
          <div className="settings-general-title">Profile Information</div>
          <div className="settings-general-subtitle">
            Configure timezone and date format display settings
          </div>

          <TextInput
            label="Username"
            defaultValue={user.displayName}
            onBlur={handleUpdate}
          />

          <AvatarSelect />

          <ThemesDropdown />
          <ColorsDropdown />
        </div>
        <div className="settings-general-date">
          <div className="settings-general-title">Date & Time</div>
          <div className="settings-general-subtitle">
            Configure profile information and appearance
          </div>

          <TimezoneDropdown />
          <DateformatDropdown />
          <TimeformatDropdown />
        </div>
      </div>
    </div>
  );
};

export default observer(SettingsGeneral);
