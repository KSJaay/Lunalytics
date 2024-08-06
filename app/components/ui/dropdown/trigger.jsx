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
  toggleDropdown,
  children,
  tabIndex = 0,
  ...props
}) => {
  const classes = classNames('dropdown-trigger', {
    'dropdown-trigger-input': asInput,
  });

  const iconClasses = classNames('dropdown-trigger-icon', {
    open: isOpen,
  });

  return (
    <div
      className={classes}
      onClick={toggleDropdown}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
      {showIcon && (
        <div className={iconClasses}>
          {icon || <FaChevronUp style={{ width: '18px', height: '18px' }} />}
        </div>
      )}
    </div>
  );
};

Trigger.displayName = 'DropdownTrigger';

Trigger.propTypes = {
  asInput: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.node,
  showIcon: PropTypes.bool,
  toggleDropdown: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default Trigger;
