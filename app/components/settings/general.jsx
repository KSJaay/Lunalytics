import './tab.scss';
import './general.scss';
import TextInput from '../ui/input';
import Dropdown from '../ui/dropdown';
import timezones from '../../constant/timeformats.json';
import timeformats from '../../constant/dateformats.json';
import { createPostRequest } from '../../services/axios';
import { parseUserCookie } from '../../utils/cookies';

const SettingsGeneral = () => {
  const userTimezone =
    window?.localStorage?.getItem('timezone') ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const userDateFormat =
    window?.localStorage?.getItem('dateformat') ||
    'Intl.DateTimeFormat().resolvedOptions().timeZone';

  const userTimeFormat =
    window?.localStorage?.getItem('timeformat') ||
    'Intl.DateTimeFormat().resolvedOptions().timeZone';

  const user = parseUserCookie(window?.document?.cookie);

  const handleUpdate = async (e, type) => {
    if (type === 'timezone' || type === 'dateformat' || type === 'timeformat') {
      window.localStorage.setItem(type, e.target.value);
    }

    // if (type === 'color') {
    //   console.log(e.target.value);
    // }

    // if (type === 'theme') {
    //   console.log(e.target.value);
    // }

    if (type === 'displayName') {
      await createPostRequest('/user/update', {
        displayName: e.target.value,
      });

      return;
    }

    if (type === 'avatar') {
      await createPostRequest('/user/update', {
        avatar: e.target.value,
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
          <Dropdown
            label="Avatar"
            options={[]}
            onChange={(e) => handleUpdate(e, 'avatar')}
          />
          {/* <Dropdown
            label="Color"
            options={[
              { name: 'Blue', value: 'blue' },
              { name: 'Purple', value: 'purple' },
              { name: 'Green', value: 'green' },
              { name: 'Yellow', value: 'yellow' },
              { name: 'Red', value: 'red' },
              { name: 'Cyan', value: 'cyan' },
              { name: 'Pink', value: 'pink' },
            ]}
          />
          <Dropdown
            label="Theme"
            options={[
              { name: 'Dark', value: 'dark' },
              { name: 'Light', value: 'light' },
            ]}
          /> */}
          <TextInput
            label="Username"
            defaultValue={user.displayName}
            onBlur={(e) => {
              handleUpdate(e, 'displayName');
            }}
          />
        </div>
        <div className="settings-general-date">
          <div className="settings-general-title">Date & Time</div>
          <div className="settings-general-subtitle">
            Configure profile information and appearance
          </div>
          <Dropdown
            label="Timezone"
            options={timezones}
            defaultValue={userTimezone}
            onChange={(e) => handleUpdate(e, 'timezone')}
          />
          <Dropdown
            label="Date Format"
            defaultValue={userDateFormat}
            options={timeformats}
            onChange={(e) => handleUpdate(e, 'dateformat')}
          />
          <Dropdown
            label="Time Format"
            value={userTimeFormat}
            options={[
              { name: '23:59:59', value: '4' },
              { name: '23:59', value: '3' },
              { name: '11:59', value: '2' },
              { name: '11:59 PM', value: '1' },
            ]}
            onChange={(e) => handleUpdate(e, 'timeformat')}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsGeneral;
