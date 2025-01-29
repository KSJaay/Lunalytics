import './checkbox.scss';
import PropTypes from 'prop-types';

const Checkbox = ({ label, description, shortDescription, ...props }) => {
  return (
    <>
      <div className="checkbox-container">
        <div>
          <label className="checkbox-input-label">{label}</label>
          {shortDescription && (
            <div className="input-short-description">{shortDescription}</div>
          )}
        </div>
        <label className="checkbox-switch">
          <input type="checkbox" {...props} />
          <span className="checkbox-slider"></span>
        </label>
      </div>

      {description && <div className="checkbox-description">{description}</div>}
    </>
  );
};

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
};

export default Checkbox;
