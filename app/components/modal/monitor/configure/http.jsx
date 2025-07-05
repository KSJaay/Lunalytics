// import dependencies
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorHttpStatusCodes from '../pages/http/statusCodes';
import MonitorHttpHeaders from '../pages/headers';
import MonitorHttpBody from '../pages/body';
import MonitorHttpIgnoreTls from '../pages/http/ignoreTls';
import MonitorHttpMethods from '../pages/http/methods';

const MonitorConfigureHttpModal = ({ errors, inputs, handleInput }) => {
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

      {errors.method && (
        <label className="input-error" id="text-input-http-method-error">
          {errors.method}
        </label>
      )}

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

          <MonitorHttpStatusCodes
            selectedIds={inputs.valid_status_codes}
            handleStatusCodeSelect={(code) => {
              const { valid_status_codes = [] } = inputs;
              const validStatusCodes = valid_status_codes.includes(code)
                ? valid_status_codes.filter((id) => id !== code)
                : valid_status_codes.concat(code);
              handleInput('valid_status_codes', validStatusCodes);
            }}
          />

          {errors.valid_status_codes ? (
            <label className="input-error">{errors.valid_status_codes}</label>
          ) : null}

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

MonitorConfigureHttpModal.displayName = 'MonitorConfigureHttpModal';

MonitorConfigureHttpModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureHttpModal;
