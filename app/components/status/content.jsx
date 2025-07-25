import {
  MdLock,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from 'react-icons/md';
import { useMemo } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { IoReloadSharp } from 'react-icons/io5';

import StatusConfigureAppearance from './configure/appearance';
import StatusConfigureLayout from './configure/layout';
import StatusConfigureSettings from './configure/settings';
import StatusConfigurePreview from './configure/preview';
import ActionBar from '../ui/actionBar';
import useContextStore from '../../context';
import handleCreateOrEditStatusPage from '../../handlers/status/configure/create';
import useStatusPageContext from '../../context/status-page';

const StatusConfigureContent = ({ currentTab, showActionBar = true }) => {
  const {
    statusStore: { addStatusPage, activeStatusPage: statusPage },
  } = useContextStore();

  const { resetStatusPage, settings, layoutItems } = useStatusPageContext;

  const showSaveActionBar = useMemo(() => {
    return (
      JSON.stringify({ settings, layout: layoutItems }) !==
      JSON.stringify({
        settings: statusPage?.settings,
        layout: statusPage?.layout,
      })
    );
  }, [
    JSON.stringify(settings),
    JSON.stringify(layoutItems),
    JSON.stringify(statusPage),
  ]);

  const handleUpdate = async (data) => {
    addStatusPage(data);
    resetStatusPage(data.settings, data.layout);
  };

  return (
    <>
      <div className="sc-account-container" id="sc-account-container">
        <div className="sc-content">
          {currentTab === 'Appearance' ? <StatusConfigureAppearance /> : null}
          {currentTab === 'Settings' ? <StatusConfigureSettings /> : null}
          {currentTab === 'Layout' ? <StatusConfigureLayout /> : null}
        </div>
        {currentTab === 'Preview' ? (
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
            </div>{' '}
          </div>
        ) : null}
      </div>

      {showActionBar ? (
        <ActionBar
          position="bottom"
          variant="floating"
          show={showSaveActionBar}
        >
          <div className="status-action-bar-container">
            <div className="title">
              Found some changes! Please save or cancel.
            </div>
            <div className="buttons">
              <Button
                color="red"
                variant="flat"
                onClick={() => {
                  resetStatusPage(statusPage.settings, statusPage.layout);
                }}
              >
                Cancel
              </Button>
              <Button
                color="green"
                variant="flat"
                onClick={() => {
                  handleCreateOrEditStatusPage(
                    settings,
                    layoutItems,
                    handleUpdate,
                    true,
                    statusPage.statusId
                  );
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </ActionBar>
      ) : null}
    </>
  );
};

export default observer(StatusConfigureContent);
