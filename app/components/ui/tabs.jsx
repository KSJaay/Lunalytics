import PropTypes from 'prop-types';

const Tabs = ({
  label,
  id,
  description,
  shortDescription,
  options = [],
  activeOption,
  tabIndex = 0,
  onChange,
  color,
  error,
  ...props
}) => {
  const colorName = color ? `var(--${color}-700)` : 'var(--accent-700)';

  return (
    <div>
      {label && <label className="input-label">{label}</label>}
      {shortDescription && (
        <div className="input-short-description">{shortDescription}</div>
      )}
      <div className="input-theme-container">
        {options.map((item) => (
          <div
            id={id}
            key={item}
            tabIndex={tabIndex}
            className="input-theme-item"
            style={{
              backgroundColor: activeOption === item ? colorName : '',
            }}
            onClick={() => onChange(item)}
            {...props}
          >
            {item}
          </div>
        ))}
      </div>

      {error && (
        <label className="input-error" id={`text-input-error-${id}`}>
          {error}
        </label>
      )}
      {description && <div className="input-description">{description}</div>}
    </div>
  );
};

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
  options: PropTypes.array,
  activeOption: PropTypes.string,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  color: PropTypes.string,
  error: PropTypes.string,
};

export default Tabs;
