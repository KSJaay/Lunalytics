// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const MonitorAddInterval = ({ inputs, errors, handleInput }) => {
  return (
    <>
      <TextInput
        id="input-interval"
        type="number"
        label="Interval"
        onChange={(e) => {
          handleInput('interval', e.target.value);
        }}
        value={inputs.interval}
        error={errors.interval}
      />

      <TextInput
        id="input-retry-interval"
        type="number"
        label="Retry Interval"
        onChange={(e) => {
          handleInput('retryInterval', e.target.value);
        }}
        value={inputs.retryInterval}
        error={errors.retryInterval}
      />

      <TextInput
        id="input-request-timeout"
        type="number"
        label="Request Timeout"
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
