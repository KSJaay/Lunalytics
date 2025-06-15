// import styles
import classNames from 'classnames';
import './input.scss';

// import dependencies
import PropTypes from 'prop-types';

const TextInput = ({
  label,
  id,
  description,
  shortDescription,
  error,
  iconLeft,
  iconRight,
  isRequired,
  tabIndex = 0,
  containerStyle = {},
  ...props
}) => {
  const classes = classNames('text-input', {
    'text-input-icon-left': iconLeft,
    'text-input-icon-right': iconRight,
  });
  return (
    <>
      {label && (
        <label className="input-label" id={`text-input-label-${id}`}>
          {label}
          {isRequired && <span className="input-required">*</span>}
        </label>
      )}
      {shortDescription && (
        <div className="input-short-description">{shortDescription}</div>
      )}
      <div className="text-input-container" style={containerStyle}>
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
        <label className="input-error" id={`text-input-error-${id}`}>
          {error}
        </label>
      )}
      {description && <div className="input-description">{description}</div>}
    </>
  );
};

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
  error: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  tabIndex: PropTypes.number,
  isRequired: PropTypes.bool,
};

export default TextInput;
