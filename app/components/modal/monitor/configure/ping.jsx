// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';

const MonitorConfigurePingModal = ({ errors, inputs, handleInput, pageId }) => {
  return (
    <>
      {pageId === 'basic' ? (
        <>
          <Input
            id="input-url"
            title="URL/IP"
            value={inputs.url}
            onChange={(event) => {
              handleInput('url', event.target.value);
            }}
            error={errors.url}
            subtitle="The URL or IP address to ping."
            color="var(--lunaui-accent-900)"
          />
        </>
      ) : null}

      {pageId === 'notification' ? (
        <>
          <MonitorPageNotification
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}

      {pageId === 'interval' ? (
        <>
          <MonitorPageInterval
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
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

MonitorConfigurePingModal.displayName = 'MonitorConfigurePingModal';

MonitorConfigurePingModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigurePingModal;
