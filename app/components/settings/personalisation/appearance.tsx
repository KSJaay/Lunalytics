// import dependencies
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { Button, Input } from '@lunalytics/ui';

// import local files
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
            <Input placeholder="Message" />
          </div>

          <Button color="primary" style={{ marginLeft: '10px' }}>
            Edit user
          </Button>
        </div>
      </div>
    </>
  );
};

SettingsPersonalisationAppearance.displayName =
  'SettingsPersonalisationAppearance';

export default observer(SettingsPersonalisationAppearance);
