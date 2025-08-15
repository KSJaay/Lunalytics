import './switch.scss';
import PropTypes from 'prop-types';
import { Switch } from '@lunalytics/ui';

const SwitchWithText = ({ label, description, shortDescription, ...props }) => {
  return (
    <>
      <div className="checkbox-container">
        <div>
          <label className="checkbox-input-label">{label}</label>
          {shortDescription && (
            <div className="input-short-description">{shortDescription}</div>
          )}
        </div>
        <Switch {...props} />
      </div>

      {description && <div className="checkbox-description">{description}</div>}
    </>
  );
};

SwitchWithText.displayName = 'SwitchWithText';

SwitchWithText.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
};

export default SwitchWithText;
