// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

const MonitorAddInterval = ({ inputs, errors, handleInput }) => {
  return (
    <>
      <Input
        id="input-interval"
        type="number"
        title="Interval"
        onChange={(e) => {
          handleInput('interval', e.target.value);
        }}
        value={inputs.interval}
        error={errors.interval}
      />

      <Input
        id="input-retry-interval"
        type="number"
        title="Retry Interval"
        onChange={(e) => {
          handleInput('retryInterval', e.target.value);
        }}
        value={inputs.retryInterval}
        error={errors.retryInterval}
      />

      <Input
        id="input-request-timeout"
        type="number"
        title="Request Timeout"
        onChange={(e) => {
          handleInput('requestTimeout', e.target.value);
        }}
        value={inputs.requestTimeout}
        error={errors.requestTimeout}
      />
    </>
  );
};

MonitorAddInterval.displayName = 'MonitorAddInterval';

MonitorAddInterval.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorAddInterval;
