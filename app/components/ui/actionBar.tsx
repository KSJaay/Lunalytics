import './actionBar.scss';

// import dependencies
import classNames from 'classnames';

interface ActionBarProps {
  show: boolean;
  variant?: 'full' | 'compact';
  position?: 'top' | 'bottom';
  slideDirection?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

const ActionBar = ({
  show,
  variant = 'full',
  position = 'bottom',
  slideDirection = 'up',
  className,
  children,
  ...props
}: ActionBarProps) => {
  const classes = classNames(
    className,
    'action-bar',
    variant,
    position,
    `slide-${slideDirection}`,
    {
      visible: show,
    }
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default ActionBar;
