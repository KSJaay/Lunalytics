// import dependencies
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';

const MonitorConfigurePingModal = ({ errors, inputs, handleInput }) => {
  return (
    <>
      <Input
        id="input-url"
        title="URL/IP"
        value={inputs.url}
        onChange={(event) => {
          handleInput('url', event.target.value);
        }}
        error={errors.url}
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

MonitorConfigurePingModal.displayName = 'MonitorConfigurePingModal';

MonitorConfigurePingModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigurePingModal;
