// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

// import local files
import Button from '../../ui/button';
import TextInput from '../../ui/input';
import useContextStore from '../../../context';

const SettingsPersonalisationAppearance = ({
  dateformat,
  timeformat,
  theme,
}) => {
  const {
    userStore: {
      user: { displayName },
    },
  } = useContextStore();

  const message =
    theme === 'dark'
      ? 'Woow this looks so nice to my eyes'
      : theme === 'light'
      ? 'Why is it so bright, I can barely look at this'
      : 'I have no clue, might be dark, might be light';

  return (
    <>
      <div className="settings-subtitle">Appearance</div>
      <div className="settings-appearance-container">
        <div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="settings-appearance-icon">
              {displayName?.charAt(0)?.toUpperCase()}
            </div>

            <div className="settings-appearance-info">
              <div className="settings-appearance-displayname">
                <div
                  className="settings-appearance-name"
                  style={{ fontWeight: '700', fontSize: '18px' }}
                >
                  {displayName}
                </div>
                <div className="settings-appearance-time">
                  {dayjs(Date.now()).format(`${dateformat} ${timeformat}`)}
                </div>
              </div>
              <div>Configure the appearance using the controls below</div>
              <div>{message}</div>
            </div>
          </div>
        </div>

        <div className="settings-appearance-content">
          <div style={{ flex: 1 }}>
            <TextInput placeholder="Message" />
          </div>

          <Button color={'primary'} style={{ marginLeft: '10px' }}>
            Edit User
          </Button>
        </div>
      </div>
    </>
  );
};

SettingsPersonalisationAppearance.displayName =
  'SettingsPersonalisationAppearance';

SettingsPersonalisationAppearance.propTypes = {
  dateformat: PropTypes.string,
  timeformat: PropTypes.string,
  theme: PropTypes.string,
};

export default observer(SettingsPersonalisationAppearance);
