// import dependencies
import PropTypes from 'prop-types';
import { Accordion, AccordionItem } from '@lunalytics/ui';

// import local files
import MonitorPageTcp from '../pages/tcp';
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';

const MonitorConfigureTcpModal = ({ errors, inputs, handleInput }) => {
  return (
    <>
      <MonitorPageTcp
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
      />

      <br />
      <Accordion dark>
        <AccordionItem
          title="Advanced Settings"
          subtitle={
            'Setup advanced settings for the monitor, such as intervals, notifications, and others.'
          }
          id="monitor-advanced-settings"
        >
          <MonitorPageNotification
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />

          <MonitorPageInterval
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />

          <br />
        </AccordionItem>
      </Accordion>
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
