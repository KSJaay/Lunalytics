// import dependencies
import PropTypes from 'prop-types';
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

Container.displayName = 'Dropdown.Container';

Container.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['left', 'right', 'center', 'top']),
};

export default Container;
