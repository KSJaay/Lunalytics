// import dependencies
import PropTypes from 'prop-types';

// import local files
import MonitorHttpMethods from './methods';

const MonitorAddHttp = ({ inputs, errors, handleInput }) => {
  const handleMethodSelect = (method) => {
    handleInput('method', method);
  };

  return (
    <>
      <MonitorHttpMethods
        selectValue={inputs.method}
        handleSelect={handleMethodSelect}
      />
      {errors.method && (
        <label className="input-error" id="text-input-http-method-error">
          {errors.method}
        </label>
      )}
    </>
  );
};

MonitorAddHttp.displayName = 'MonitorAddHttp';

MonitorAddHttp.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorAddHttp;
