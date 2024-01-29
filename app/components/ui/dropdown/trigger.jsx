// import dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import local files
import FaChevronUp from '../../icons/faChevronUp';

const Trigger = ({
  asInput,
  isOpen,
  icon,
  showIcon,
  toggleDropdown,
  children,
  ...props
}) => {
  const classes = classNames('dropdown-trigger', {
    'dropdown-trigger-input': asInput,
  });

  const iconClasses = classNames('dropdown-trigger-icon', {
    open: isOpen,
  });

  return (
    <div className={classes} onClick={toggleDropdown} {...props}>
      {children}
      {showIcon && (
        <div className={iconClasses}>
          {icon || <FaChevronUp width={18} height={18} />}
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
  children: PropTypes.node.isRequired,
};

export default Trigger;
