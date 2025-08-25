// import dependencies
import classNames from 'classnames';

// import local files
import { FaChevronUp } from '../../icons';

interface DropdownTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  color?: string;
  tabIndex?: number;
  asInput?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  toggleDropdown?: () => void;
}

const Trigger = ({
  asInput,
  isOpen,
  icon,
  showIcon,
  toggleDropdown,
  children,
  tabIndex = 0,
  color = 'var(--lunaui-accent-800)',
  ...props
}: DropdownTriggerProps) => {
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
      style={{ ...props.style, backgroundColor: color }}
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

export default Trigger;
