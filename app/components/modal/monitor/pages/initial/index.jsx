// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../../ui/input';
import MonitorInitialDropdown from './type';

const MonitorInitialType = ({ inputs, errors, handleInput, isEdit }) => {
  return (
    <>
      <TextInput
        label="Name"
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
        <TextInput
          label="Monitor Type"
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
