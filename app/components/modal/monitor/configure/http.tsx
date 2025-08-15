// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorHttpStatusCodes from '../pages/http/statusCodes';
import MonitorHttpHeaders from '../pages/headers';
import MonitorHttpBody from '../pages/body';
import MonitorHttpIgnoreTls from '../pages/http/ignoreTls';
import MonitorHttpMethods from '../pages/http/methods';

const MonitorConfigureHttpModal = ({ errors, inputs, handleInput, pageId }) => {
  return (
    <>
      {pageId === 'basic' ? (
        <>
          <Input
            id="input-url"
            title={'URL'}
            value={inputs.url}
            onChange={(event) => {
              handleInput('url', event.target.value);
            }}
            error={errors.url}
            color="var(--lunaui-accent-900)"
            subtitle="The URL to monitor. Must start with http:// or https://"
          />

          <MonitorHttpMethods
            error={errors.method}
            selectValue={inputs.method}
            handleSelect={(method) => handleInput('method', method)}
          />
        </>
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
        <>
          <MonitorHttpStatusCodes
            error={errors.valid_status_codes}
            selectedIds={inputs.valid_status_codes}
            handleStatusCodeSelect={(code) => {
              const { valid_status_codes = [] } = inputs;
              const validStatusCodes = valid_status_codes.includes(code)
                ? valid_status_codes.filter((id) => id !== code)
                : valid_status_codes.concat(code);
              handleInput('valid_status_codes', validStatusCodes);
            }}
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
        </>
      ) : null}
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
