// import dependencies
import PropTypes from 'prop-types';

// import local files
import MonitorPageTcp from '../pages/tcp';
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';

const MonitorConfigureTcpModal = ({ errors, inputs, handleInput, pageId }) => {
  return (
    <>
      {pageId === 'basic' ? (
        <MonitorPageTcp
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'interval' ? (
        <MonitorPageInterval
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'notification' ? (
        <MonitorPageNotification
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'advanced' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-xl)',
            color: 'var(--font-light-color)',
            fontWeight: 500,
          }}
        >
          Nothing to see here, maybe there will be more stuff here in the future
        </div>
      ) : null}
    </>
  );
};

MonitorConfigureTcpModal.displayName = 'MonitorConfigureTcpModal';

MonitorConfigureTcpModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureTcpModal;
