import {
  MdLock,
  MdOutlineArrowBack,
  MdOutlineArrowForward,
} from 'react-icons/md';
import { isEqual } from 'es-toolkit';
import { useMemo } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

import StatusConfigureAppearance from '../configure/appearance';
import StatusConfigureLayout from '../configure/layout';
import StatusConfigureSettings from '../configure/settings';
import { IoReloadSharp } from 'react-icons/io5';
import StatusConfigurePreview from '../configure/preview';
import ActionBar from '../../ui/actionBar';
import useContextStore from '../../../context';
import handleCreateOrEditStatusPage from '../../../handlers/status/configure/create';
import useStatusPageContext from '../../../context/status-page';

const StatusConfigureContent = ({
  currentTab,
  activeStatusId,
  showActionBar = true,
}) => {
  const {
    statusStore: { addStatusPage, getStatusById },
  } = useContextStore();

  const { resetStatusPage, settings, layoutItems } = useStatusPageContext;

  const showSaveActionBar = useMemo(() => {
    const statusPageById = getStatusById(activeStatusId);

    return !isEqual(
      { settings, layout: layoutItems },
      { settings: statusPageById?.settings, layout: statusPageById?.layout }
    );
  }, [activeStatusId, JSON.stringify(settings), JSON.stringify(layoutItems)]);

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
          show={showSaveActionBar}
          position="bottom"
          variant="floating"
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
                  const statusPageById = getStatusById(activeStatusId);
                  if (!statusPageById) return;

                  resetStatusPage(
                    statusPageById.settings,
                    statusPageById.layout
                  );
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
                    activeStatusId
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
