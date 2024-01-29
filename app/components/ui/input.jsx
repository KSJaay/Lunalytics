// import styles
import './input.scss';

// import dependencies
import PropTypes from 'prop-types';

const TextInput = ({ label, id, error, ...props }) => {
  return (
    <>
      {label && <label className="text-input-label">{label}</label>}
      <input type="text" className="text-input" id={id} {...props} />
      {error && <label className="text-input-error">{error}</label>}
    </>
  );
};

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
};

export default TextInput;
