import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';
import { Button, Input } from '@lunalytics/ui';
import { useEffect, useMemo, useState } from 'react';

// import local files
import Switch from '../../../ui/switch';
import useStatusPageContext from '../../../../context/status-page';

const StatusConfigureSettings = () => {
  const [domainSize, setDomainSize] = useState(1);
  const { changeValues, settings } = useStatusPageContext();
  const domains = useMemo(
    () => settings.customDomains || [],
    [settings.customDomains]
  );

  useEffect(() => {
    setDomainSize(domains.length || 1);
  }, [domains]);

  return (
    <>
      <div className="scc-block">
        <div>
          <div className="scc-title">Name and homepage</div>
        </div>

        <div style={{ gap: '12px' }}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
            <Input
              title="Name of status page"
              placeholder="Status"
              subtitle="This will be used as the page title and friendly name for the status page."
              value={settings.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeValues({ title: e.target.value });
              }}
            />
          </div>
          <div>
            <Input
              title="Homepage URL"
              placeholder="https://lunalytics.xyz"
              subtitle="URL for where the user will be redirect when they click the logo or title."
              value={settings.homepageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeValues({ homepageUrl: e.target.value });
              }}
            />
          </div>
        </div>
      </div>

      <div className="scc-block">
        <div>
          <div className="scc-title">Custom Domain</div>
          <div className="scc-description">
            Custom domains will show the status page on that domain.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {Array.from({ length: domainSize }).map((_, index) => (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '12px',
              }}
              key={index}
            >
              <Input
                key={index}
                value={domains[index] || ''}
                placeholder="status.yourdomain.com"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeValues({
                    customDomains: [
                      ...domains.slice(0, index),
                      e.target.value,
                      ...domains.slice(index + 1),
                    ],
                  });
                }}
                style={{ flex: 1 }}
                fullWidth
              />

              <div
                style={{
                  cursor: 'pointer',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition-base)',
                  backgroundColor: 'var(--accent-800)',
                  aspectRatio: '1 / 1',
                }}
                onClick={() => {
                  changeValues({
                    customDomains: domains.filter((_, i) => i !== index),
                  });
                  setDomainSize(domainSize - 1);
                }}
              >
                <FaTrashCan size={18} />
              </div>
            </div>
          ))}

          <Button
            fullWidth
            variant="flat"
            onClick={() => setDomainSize(domainSize + 1)}
          >
            Add Custom Domain
          </Button>
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
          <Switch
            label="Publicly available"
            shortDescription="Should the status page be visible users who are not signed into the application."
            checked={settings.isPublic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeValues({ isPublic: e.target.checked });
            }}
          />
          <Switch
            label="Hide paused monitors"
            shortDescription="When a monitor is paused, it will not be visible on the status page."
            checked={settings.hidePaused}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeValues({ hidePaused: e.target.checked });
            }}
          />
        </div>
      </div>
    </>
  );
};

StatusConfigureSettings.displayName = 'StatusConfigureSettings';

export default observer(StatusConfigureSettings);
