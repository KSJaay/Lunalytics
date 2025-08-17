import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { Button, Modal } from '@lunalytics/ui';
import { CgWebsite } from 'react-icons/cg';
import { FaClock, FaCog, FaCogs } from 'react-icons/fa';

// import local files
import MonitorPageInitial from './pages/initial';
import useMonitorForm from '../../../hooks/useMonitorForm';
import MonitorConfigureHttpModal from './configure/http';
import MonitorConfigureJsonQueryModal from './configure/json';
import MonitorConfigurePingModal from './configure/ping';
import MonitorConfigureTcpModal from './configure/tcp';

import { MdNotifications } from 'react-icons/md';
import { useState } from 'react';

const pages = [
  { id: 'basic', title: 'Basic', icon: <FaCog size={20} /> },
  { id: 'interval', title: 'Intervals', icon: <FaClock size={20} /> },
  {
    id: 'notification',
    title: 'Notifications',
    icon: <MdNotifications size={24} />,
  },
  { id: 'advanced', title: 'Advanced', icon: <FaCogs size={20} /> },
];

const MonitorConfigureModal = ({
  closeModal,
  monitor,
  handleMonitorSubmit,
  isEdit = false,
}) => {
  const [pageId, setPageId] = useState('basic');
  const { errors, inputs, handleActionButtons, handleInput } = useMonitorForm(
    monitor,
    isEdit,
    closeModal,
    handleMonitorSubmit
  );

  return (
    <Modal size="xl" height="lg">
      <div className="monitor-configure">
        <div className="monitor-configure-left-container">
          <div className="monitor-configure-left-title">
            <CgWebsite size={24} />
            <div>{isEdit ? 'Edit Monitor' : 'Add Monitor'}</div>
          </div>
          <div className="monitor-configure-left-subtitle">
            Select the type of monitor you want to setup and customise the
            settings to your liking.
          </div>
          <div className="monitor-configure-left-pages">
            {pages.map((page) => (
              <div
                className={
                  page.id === pageId
                    ? 'monitor-configure-page-button active'
                    : 'monitor-configure-page-button'
                }
                onClick={() => setPageId(page.id)}
                key={page.id}
              >
                {page.icon}
                <div>{page.title}</div>
              </div>
            ))}
          </div>

          <div className="monitor-configure-buttons">
            <Button
              color="red"
              variant="flat"
              fullWidth
              onClick={handleActionButtons('Cancel')}
            >
              Cancel
            </Button>
            <Button
              color="green"
              variant="flat"
              fullWidth
              disabled={Object.keys(errors).length > 0}
              onClick={handleActionButtons('Create')}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
        <div className="monitor-configure-content">
          <div>
            {pageId === 'basic' ? (
              <MonitorPageInitial
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                isEdit={isEdit}
              />
            ) : null}

            {inputs.type === 'http' ? (
              <MonitorConfigureHttpModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
              />
            ) : null}
            {inputs.type === 'json' ? (
              <MonitorConfigureJsonQueryModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
              />
            ) : null}
            {inputs.type === 'ping' ? (
              <MonitorConfigurePingModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
              />
            ) : null}
            {inputs.type === 'tcp' ? (
              <MonitorConfigureTcpModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

MonitorConfigureModal.displayName = 'MonitorConfigureModal';

MonitorConfigureModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureModal;
