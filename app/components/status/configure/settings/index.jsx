// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import Checkbox from '../../../ui/checkbox';
import TextInput from '../../../ui/input';

const StatusConfigureSettings = () => {
  const { changeValues, settings = {} } = useStatusContext();

  return (
    <>
      <div className="scc-block">
        <div>
          <div className="scc-title">Name and homepage</div>
          <div className="scc-description"></div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label className="input-label" id={`text-input-label-status-url`}>
              Status Page URL
            </label>

            <div className="input-short-description">
              URL will be prefixed with /status (Use &#34;default&#34; to use
              the index route)
            </div>

            <div
              className="text-input-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                className="text-input"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
                  color: 'var(--font-light-color)',
                  width: 'fit-content',
                  backgroundColor: 'var(--accent-700)',
                }}
              >
                /status/
              </div>
              <input
                type="text"
                className="text-input"
                id={'status-url'}
                tabIndex={0}
                value={settings.url}
                onChange={(e) => {
                  changeValues({ url: e.target.value });
                }}
                style={{
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                }}
              />
            </div>
          </div>

          <div>
            <TextInput
              label="Name of status page"
              placeholder="Status"
              shortDescription="This will be used as the page title and friendly name for the status page."
              value={settings.title}
              onChange={(e) => {
                changeValues({ title: e.target.value });
              }}
            />
          </div>
          <div>
            <TextInput
              label="Homepage URL"
              placeholder="https://lunalytics.xyz"
              shortDescription="URL for where the user will be redirect when they click the logo or title."
              value={settings.homepageUrl}
              onChange={(e) => {
                changeValues({ homepageUrl: e.target.value });
              }}
            />
          </div>
        </div>
      </div>

      <div className="scc-block">
        <div className="scc-title">Toggle settings</div>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          <Checkbox
            label="Publicly available"
            shortDescription="Should the status page be visible users who are not signed into the application."
            value={settings.isPublic}
            onChange={(e) => {
              changeValues({ isPublic: e.target.checked });
            }}
          />
          <Checkbox
            label="Hide paused monitors"
            shortDescription="When a monitor is paused, it will not be visible on the status page."
            value={settings.hidePaused}
            onChange={(e) => {
              changeValues({ hidePaused: e.target.checked });
            }}
          />
        </div>
      </div>
    </>
  );
};

StatusConfigureSettings.displayName = 'StatusConfigureSettings';

StatusConfigureSettings.propTypes = {};

export default StatusConfigureSettings;
