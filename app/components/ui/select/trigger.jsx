// import dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import local files
import { FaChevronUp } from '../../icons';

const Trigger = ({
  asInput,
  isOpen,
  icon,
  showIcon,
  toggleSelect,
  children,
  ...props
}) => {
  const classes = classNames('select-trigger', {
    'select-trigger-input': asInput,
  });

  const iconClasses = classNames('select-trigger-icon', {
    open: isOpen,
  });

  return (
    <div className={classes} onClick={toggleSelect} {...props}>
      {children}
      {showIcon && (
        <div className={iconClasses}>
          {icon || <FaChevronUp style={{ width: '18px', height: '18px' }} />}
        </div>
      )}
    </div>
  );
};

Trigger.displayName = 'Select.Trigger';

Trigger.propTypes = {
  asInput: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.node,
  showIcon: PropTypes.bool,
  toggleSelect: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Trigger;
