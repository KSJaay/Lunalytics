import './actionBar.scss';

// import dependencies
import classNames from 'classnames';

const ActionBar = ({
  show,
  variant = 'full',
  position = 'bottom',
  slideDirection = 'up',
  className,
  children,
  ...props
}) => {
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
