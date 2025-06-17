import '../../styles/pages/status/configure.scss';

// import dependencies
import { useState } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoReloadSharp } from 'react-icons/io5';
import {
  MdLock,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from 'react-icons/md';

// import local files
import StatusConfigureAppearance from '../../components/status/configure/appearance';
import {
  ConfigureStatusProvider,
  useConfigureStatusState,
} from '../../hooks/useConfigureStatus';
import StatusConfigureSettings from '../../components/status/configure/settings';
import StatusConfigureLayout from '../../components/status/configure/layout';
import StatusConfigurePreview from '../../components/status/configure/preview';
import handleCreateOrEditStatusPage from '../../handlers/status/configure/create';
import useContextStore from '../../context';

const pages = ['Appearance', 'Settings', 'Layout', 'Preview'];

const StatusConfigure = () => {
  const navigate = useNavigate();
  const {
    statusStore: { addStatusPage, getStatusById },
  } = useContextStore();

  const [searchParams] = useSearchParams();

  const statusPageId = searchParams.get('statusPageId');
  const statusPageValues = getStatusById(statusPageId);

  const statusValues = useConfigureStatusState(
    statusPageValues?.settings,
    statusPageValues?.layout
  );

  const [activePage, setActivePage] = useState('Appearance');

  const handleRedirect = async (data) => {
    addStatusPage(data);
    navigate('/status-pages');
  };

  return (
    <ConfigureStatusProvider value={statusValues}>
      <div className="sc-container">
        <div className="sc-tab">
          <div className="sch">
            <div className="sch-title">Status Page</div>
            <div className="sch-spacer">|</div>
            <div className="sch-subtitle">
              Configure a status page to display information about specific
              monitors
            </div>
          </div>
          <div className="sch-options-list">
            <div className="sch-options-item">
              {pages.map((page) => (
                <div
                  key={page}
                  className={`sc-tab-text${
                    page === activePage ? ' active' : ''
                  }`}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </div>
              ))}
            </div>
            <div className="sch-buttons">
              <div>
                <Button
                  color="red"
                  onClick={() => {
                    navigate('/status-pages');
                  }}
                >
                  Discard
                </Button>
              </div>
              <div>
                <Button
                  color="green"
                  onClick={() =>
                    handleCreateOrEditStatusPage(
                      statusValues.settings,
                      statusValues.layout,
                      handleRedirect,
                      statusPageId && statusPageValues,
                      statusPageId
                    )
                  }
                >
                  {statusPageId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="sc-account-container" id="sc-account-container">
          <div className="sc-content">
            {activePage === 'Appearance' ? <StatusConfigureAppearance /> : null}

            {activePage === 'Settings' ? <StatusConfigureSettings /> : null}
            {activePage === 'Layout' ? <StatusConfigureLayout /> : null}
          </div>

          {activePage === 'Preview' ? (
            <div className="sppw-container">
              <div className="sppw">
                <div className="sppw-header">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className="sppw-navbar">
                  <div className="sppw-navbar-item">
                    <MdOutlineArrowBack />
                  </div>
                  <div className="sppw-navbar-item">
                    <MdOutlineArrowForward />
                  </div>
                  <div className="sppw-navbar-item">
                    <IoReloadSharp />
                  </div>
                  <div className="sppw-navbar-search">
                    <MdLock />
                    <div>{window.location.href}</div>
                  </div>
                </div>
                <div style={{ overflow: 'auto' }}>
                  <div className="status-page-content">
                    <StatusConfigurePreview />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ConfigureStatusProvider>
  );
};

StatusConfigure.displayName = 'StatusConfigure';

StatusConfigure.propTypes = {};

export default observer(StatusConfigure);
