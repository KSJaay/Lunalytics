// import dependencies
import PropTypes from 'prop-types';
import SwitchWithText from '../../../../ui/switch';

const MonitorHttpIgnoreTls = ({ handleChange, checkboxValue = false }) => {
  return (
    <div style={{ padding: '1rem 0' }}>
      <SwitchWithText
        label="Ignore TLS"
        shortDescription="Ignore TLS certificate validation for the monitor."
        checked={checkboxValue}
        onChange={(e) => handleChange('ignoreTls', e.target.checked)}
      />
    </div>
  );
};

MonitorHttpIgnoreTls.displayName = 'MonitorHttpIgnoreTls';

MonitorHttpIgnoreTls.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  selectValue: PropTypes.string,
};

export default MonitorHttpIgnoreTls;
