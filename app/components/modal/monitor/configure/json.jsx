// import dependencies
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorHttpHeaders from '../pages/headers';
import MonitorHttpBody from '../pages/body';
import MonitorHttpIgnoreTls from '../pages/http/ignoreTls';
import MonitorHttpMethods from '../pages/http/methods';
import MonitorJsonQueryCheck from '../pages/json/check';

const MonitorConfigureJsonQueryModal = ({ errors, inputs, handleInput }) => {
  return (
    <>
      <Input
        id="input-url"
        title={'URL'}
        value={inputs.url}
        onChange={(event) => {
          handleInput('url', event.target.value);
        }}
        error={errors.url}
      />

      <MonitorHttpMethods
        selectValue={inputs.method}
        handleSelect={(method) => handleInput('method', method)}
      />

      <MonitorJsonQueryCheck
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

          <MonitorHttpIgnoreTls
            handleChange={handleInput}
            checkboxValue={inputs.ignoreTls}
          />

          <MonitorHttpHeaders
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />

          <MonitorHttpBody
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

MonitorConfigureJsonQueryModal.displayName = 'MonitorConfigureJsonQueryModal';

MonitorConfigureJsonQueryModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureJsonQueryModal;
