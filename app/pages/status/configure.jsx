import '../../styles/pages/status/configure.scss';

// import dependencies
import { useState } from 'react';

// import local files
import Button from '../../components/ui/button';
import StatusConfigureAppearance from '../../components/status/appearance';
import {
  ConfigureStatusProvider,
  useConfigureStatusState,
} from '../../hooks/useConfigureStatus';
import StatusConfigureSettings from '../../components/status/settings';
import StatusConfigureLayout from '../../components/status/layout';
import StatusConfigurePreview from '../../components/status/preview';

const pages = ['Appearance', 'Settings', 'Layout', 'Preview'];

const StatusConfigure = () => {
  const statusValues = useConfigureStatusState();
  const [activePage, setActivePage] = useState('Layout');

  return (
    <>
      <div className="status-configure-container">
        <div className="status-configure-tab">
          <div className="status-configure-header">
            <div className="status-configure-header-title">Status Page</div>
            <div className="status-configure-header-spacer">|</div>
            <div className="status-configure-header-subtitle">
              Configure a status page to display information about specific
              monitors
            </div>
          </div>
          <div className="status-configure-header-options-list">
            <div className="status-configure-header-options-item">
              {pages.map((page) => (
                <div
                  key={page}
                  className={`status-configure-tab-text${
                    page === activePage ? ' active' : ''
                  }`}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </div>
              ))}
            </div>
            <div className="status-configure-header-buttons">
              <div>
                <Button outline="red">Discard</Button>
              </div>
              <div>
                <Button outline="green">Confirm</Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="status-configure-account-container"
          id="status-configure-account-container"
        >
          <ConfigureStatusProvider value={statusValues}>
            <div className="status-configure-content">
              {activePage === 'Appearance' ? (
                <StatusConfigureAppearance />
              ) : null}

              {activePage === 'Settings' ? <StatusConfigureSettings /> : null}
              {activePage === 'Layout' ? <StatusConfigureLayout /> : null}
            </div>

            {activePage === 'Preview' ? (
              <div className="status-page-content">
                <StatusConfigurePreview />
              </div>
            ) : null}

            <div className="settings-account-mobile-container mobile-shown"></div>
          </ConfigureStatusProvider>
        </div>
      </div>
    </>
  );
};

StatusConfigure.displayName = 'StatusConfigure';

StatusConfigure.propTypes = {};

export default StatusConfigure;
