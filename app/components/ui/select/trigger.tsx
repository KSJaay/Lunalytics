// import dependencies
import classNames from 'classnames';

// import local files
import { FaChevronUp } from '../../icons';

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asInput?: boolean;
  isOpen: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
  color?: string;
  toggleSelect: () => void;
}

const Trigger = ({
  asInput,
  isOpen,
  icon,
  showIcon,
  toggleSelect,
  children,
  color = 'var(--lunaui-accent-800)',
  ...props
}: SelectTriggerProps) => {
  const classes = classNames('select-trigger', {
    'select-trigger-input': asInput,
  });

  const iconClasses = classNames('select-trigger-icon', {
    open: isOpen,
  });

  return (
    <div
      className={classes}
      onClick={toggleSelect}
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

Trigger.displayName = 'Select.Trigger';

export default Trigger;
