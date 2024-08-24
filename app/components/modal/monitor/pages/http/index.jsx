// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../../ui/input';
import MonitorHttpMethods from './methods';
import MonitorHttpStatusCodes from './statusCodes';

const MonitorAddHttp = ({ inputs, errors, handleInput }) => {
  const handleMethodSelect = (method) => {
    handleInput('method', method);
  };

  return (
    <div className="monitor-configure-container">
      <TextInput
        id="input-url"
        label="URL"
        value={inputs.url}
        onChange={(event) => {
          handleInput('url', event.target.value);
        }}
        error={errors.url}
      />
      <MonitorHttpMethods
        selectValue={inputs.method}
        handleSelect={handleMethodSelect}
      />
      {errors.method && (
        <label className="input-error" id="text-input-http-method-error">
          {errors.method}
        </label>
      )}

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

      {errors.valid_status_codes && (
        <label className="input-error">{errors.valid_status_codes}</label>
      )}
    </div>
  );
};

MonitorAddHttp.displayName = 'MonitorAddHttp';

MonitorAddHttp.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorAddHttp;
