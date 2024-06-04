// import styles
import classNames from 'classnames';
import './input.scss';

// import dependencies
import PropTypes from 'prop-types';

const TextInput = ({
  label,
  id,
  error,
  iconLeft,
  iconRight,
  tabIndex = 0,
  ...props
}) => {
  const classes = classNames('text-input', {
    'text-input-icon-left': iconLeft,
    'text-input-icon-right': iconRight,
  });
  return (
    <>
      {label && (
        <label className="text-input-label" id={`text-input-label-${id}`}>
          {label}
        </label>
      )}
      <div className="text-input-container">
        {iconLeft && <div className="text-left-icon">{iconLeft}</div>}
        <input
          type="text"
          className={classes}
          id={id}
          tabIndex={tabIndex}
          {...props}
        />
        {iconRight && <div className="text-right-icon">{iconRight}</div>}
      </div>
      {error && (
        <label className="text-input-error" id={`text-input-error-${id}`}>
          {error}
        </label>
      )}
    </>
  );
};

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  tabIndex: PropTypes.number,
};

export default TextInput;
