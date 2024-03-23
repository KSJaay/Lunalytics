// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const MonitorAddInterval = ({ inputs, errors, handleInput }) => {
  return (
    <div style={{ minHeight: '300px', width: '400px' }}>
      <TextInput
        type="number"
        label="Interval"
        onChange={(e) => {
          handleInput('interval', e.target.value);
        }}
        value={inputs.interval}
        error={errors.interval}
      />

      <TextInput
        type="number"
        label="Retry Interval"
        onChange={(e) => {
          handleInput('retryInterval', e.target.value);
        }}
        value={inputs.retryInterval}
        error={errors.retryInterval}
      />

      <TextInput
        type="number"
        label="Request Timeout"
        onChange={(e) => {
          handleInput('requestTimeout', e.target.value);
        }}
        value={inputs.requestTimeout}
        error={errors.requestTimeout}
      />
    </div>
  );
};

MonitorAddInterval.displayName = 'MonitorAddInterval';

MonitorAddInterval.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorAddInterval;
