import './tab.scss';
import './general.scss';
import TextInput from '../ui/input';
import { createPostRequest } from '../../services/axios';
import { parseUserCookie } from '../../utils/cookies';

import {
  TimezoneDropdown,
  DateformatDropdown,
  TimeformatDropdown,
  ColorsDropdown,
  ThemesDropdown,
} from './dropdown';

const SettingsGeneral = () => {
  const user = parseUserCookie(window?.document?.cookie);

  const handleUpdate = async (e, type) => {
    if (
      type === 'displayName' &&
      user.displayName !== e.target?.value?.trim()
    ) {
      if (!e.target?.value?.trim()) {
        return;
      }

      await createPostRequest('/api/user/update/username', {
        displayName: e.target.value,
      });

      return;
    }

    if (type === 'avatar' && user.avatar !== e) {
      await createPostRequest('/api/user/update/avatar', {
        avatar: e,
      });

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
            onBlur={(e) => {
              handleUpdate(e, 'displayName');
            }}
          />

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

export default SettingsGeneral;
