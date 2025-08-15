import './style.scss';

// import local files
import useLocalStorageContext from '../../../hooks/useLocalstorage';
import SettingsPersonalisationAppearance from './appearance';
import SettingsPersonalisationTheme from './theme';
import SettingsPersonalisationAccent from './accent';
import SettingsPersonalisationTimeformat from './timeformat';
import SettingsPersonalisationDateformat from './dateformat';
import SettingsPersonalisationTimezone from './timezone';

const SettingsPersonalisation = () => {
  const {
    timezone,
    dateformat,
    timeformat,
    theme,
    color,
    setTimezone,
    setDateformat,
    setTimeformat,
    setTheme,
    setColor,
  } = useLocalStorageContext();

  return (
    <div className="settings-account-container">
      <div>
        <SettingsPersonalisationAppearance
          dateformat={dateformat}
          timeformat={timeformat}
          theme={theme}
        />
        <SettingsPersonalisationTheme theme={theme} setTheme={setTheme} />
        <SettingsPersonalisationAccent color={color} setColor={setColor} />

        <div style={{ display: 'flex', gap: '15px', margin: '15px 0px' }}>
          <SettingsPersonalisationTimeformat
            timeformat={timeformat}
            setTimeformat={setTimeformat}
          />

          <SettingsPersonalisationDateformat
            dateformat={dateformat}
            setDateformat={setDateformat}
          />
        </div>

        <SettingsPersonalisationTimezone
          timezone={timezone}
          setTimezone={setTimezone}
        />
      </div>
    </div>
  );
};

export default SettingsPersonalisation;
