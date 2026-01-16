import './styles.scss';

// import dependencies
import { useState } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { Button, Modal } from '@lunalytics/ui';
import { MdNotifications } from 'react-icons/md';
import { FaClock, FaCog, FaCogs } from 'react-icons/fa';

// import local files
import MonitorPageInitial from './pages/initial';
import MonitorConfigureTcpModal from './configure/tcp';
import MonitorConfigureHttpModal from './configure/http';
import MonitorConfigurePingModal from './configure/ping';
import useMonitorForm from '../../../hooks/useMonitorForm';
import MonitorConfigureDockerModal from './configure/docker';
import MonitorConfigureJsonQueryModal from './configure/json';
import type { MonitorProps } from '../../../types/monitor';
import MonitorConfigurePushModal from './configure/push';
import classNames from 'classnames';

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

interface ModalProps {
  closeModal: () => void;
  handleMonitorSubmit: (monitor: MonitorProps) => void;
  monitor?: MonitorProps;
  isEdit?: boolean;
}

const MonitorConfigureModal = ({
  closeModal,
  monitor,
  handleMonitorSubmit,
  isEdit = false,
}: ModalProps) => {
  const [pageId, setPageId] = useState('basic');
  const {
    errors,
    inputs,
    handleActionButtons,
    handleInput,
    errorPages,
    setErrorPages,
  } = useMonitorForm(
    monitor,
    isEdit,
    closeModal,
    handleMonitorSubmit,
    setPageId
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
            {pages.map((page) => {
              const classes = classNames('monitor-configure-page-button', {
                active: page.id === pageId,
                'error-circle': errorPages.has(page.id),
              });

              return (
                <div
                  className={classes}
                  onClick={() => {
                    setErrorPages((oldSet) => {
                      const trimmedErrorPages = new Set([...oldSet]);
                      trimmedErrorPages.delete(pageId);
                      return trimmedErrorPages;
                    });
                    setPageId(page.id);
                  }}
                  key={page.id}
                  id={`monitor-modal-${page.id}`}
                >
                  {page.icon}
                  <div>{page.title}</div>
                </div>
              );
            })}
          </div>

          <div className="monitor-configure-buttons">
            <Button
              color="red"
              variant="flat"
              fullWidth
              onClick={handleActionButtons('Cancel')}
              id="monitor-configure-cancel-button"
            >
              Cancel
            </Button>
            <Button
              color="green"
              variant="flat"
              fullWidth
              disabled={Object.keys(errors).length > 0}
              onClick={handleActionButtons('Create')}
              id="monitor-configure-submit-button"
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

            {inputs.type === 'docker' ? (
              <MonitorConfigureDockerModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
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

            {inputs.type === 'push' ? (
              <MonitorConfigurePushModal
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
                pageId={pageId}
                isEdit={isEdit}
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

export default MonitorConfigureModal;
