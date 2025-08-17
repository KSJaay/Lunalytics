// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorHttpHeaders from '../pages/headers';
import MonitorHttpBody from '../pages/body';
import MonitorHttpIgnoreTls from '../pages/http/ignoreTls';
import MonitorHttpMethods from '../pages/http/methods';
import MonitorJsonQueryCheck from '../pages/json/check';

const MonitorConfigureJsonQueryModal = ({
  errors,
  inputs,
  handleInput,
  pageId,
}) => {
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
            subtitle="The URL to monitor. Must start with http:// or https://"
            color="var(--lunaui-accent-900)"
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

      {pageId === 'notification' ? (
        <>
          <MonitorPageNotification
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}

      {pageId === 'advanced' ? (
        <>
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

MonitorConfigureJsonQueryModal.displayName = 'MonitorConfigureJsonQueryModal';

MonitorConfigureJsonQueryModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureJsonQueryModal;
