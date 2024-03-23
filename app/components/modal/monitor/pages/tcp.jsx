// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const MonitorPageTcp = ({ inputs, errors, handleInput }) => {
  return (
    <div style={{ minHeight: '300px', width: '400px' }}>
      <TextInput
        label="Host"
        value={inputs.host}
        error={errors.host}
        onChange={(e) => handleInput('host', e.target.value)}
      />

      <TextInput
        label="Port"
        value={inputs.port}
        error={errors.port}
        onChange={(e) => handleInput('port', e.target.value)}
      />
    </div>
  );
};

MonitorPageTcp.displayName = 'MonitorPageTcp';

MonitorPageTcp.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorPageTcp;
