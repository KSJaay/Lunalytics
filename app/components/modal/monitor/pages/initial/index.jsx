// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import MonitorInitialDropdown from './type';

const MonitorInitialType = ({ inputs, errors, handleInput, isEdit }) => {
  return (
    <>
      <Input
        title="Name"
        id="input-name"
        value={inputs.name || ''}
        onChange={(e) => handleInput('name', e.target.value)}
        error={errors.name}
      />

      {!isEdit && (
        <MonitorInitialDropdown
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      )}

      {isEdit && (
        <Input
          title="Monitor Type"
          value={inputs.type?.toUpperCase()}
          readOnly
        />
      )}
    </>
  );
};

MonitorInitialType.displayName = 'MonitorInitialType';

MonitorInitialType.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default MonitorInitialType;
