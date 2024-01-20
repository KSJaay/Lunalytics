// Import dependencies
import classNames from 'classnames';

const Container = ({ children, position = 'left', ...props }) => {
  const classes = classNames('dropdown', {
    'dropdown-position--right': position === 'right',
    'dropdown-position--left': position === 'left',
    'dropdown-position--center': position === 'center',
    'dropdown-position--top': position === 'top',
  });

  return (
    <details className={classes} {...props}>
      {children}
    </details>
  );
};

export default Container;
