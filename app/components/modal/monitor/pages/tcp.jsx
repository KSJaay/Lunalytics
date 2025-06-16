// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

const MonitorPageTcp = ({ inputs, errors, handleInput }) => {
  return (
    <>
      <Input
        id="input-host"
        title="Host"
        value={inputs.url}
        error={errors.url}
        onChange={(e) => handleInput('url', e.target.value)}
      />

      <Input
        id="input-port"
        title="Port"
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
