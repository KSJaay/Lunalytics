// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';

// import local files
import MonitorInitialDropdown from './type';

const MonitorInitialType = ({ inputs, errors, handleInput, isEdit }) => {
  return (
    <div className="monitor-configure-container">
      <Input
        title="Name"
        id="input-name"
        value={inputs.name || ''}
        onChange={(e) => handleInput('name', e.target.value)}
        error={errors.name}
        color="var(--lunaui-accent-900)"
        subtitle="Friendly name used to identify the monitor"
      />

      {!isEdit && (
        <MonitorInitialDropdown
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
          color="var(--lunaui-accent-900)"
        />
      )}

      {isEdit && (
        <Input
          title="Monitor Type"
          value={inputs.type?.toUpperCase()}
          readOnly
          color="var(--lunaui-accent-900)"
        />
      )}
    </div>
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
