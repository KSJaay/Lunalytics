// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const MonitorPageTcp = ({ inputs, errors, handleInput }) => {
  return (
    <>
      <TextInput
        id="input-host"
        label="Host"
        value={inputs.url}
        error={errors.url}
        onChange={(e) => handleInput('url', e.target.value)}
      />

      <TextInput
        id="input-port"
        label="Port"
        value={inputs.port}
        error={errors.port}
        onChange={(e) => handleInput('port', e.target.value)}
      />
    </>
  );
};

MonitorPageTcp.displayName = 'MonitorPageTcp';

MonitorPageTcp.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorPageTcp;
