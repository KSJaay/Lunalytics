// Import scss
import './details.scss';

// Import dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

const DropdownTrigger = ({ children, ...props }) => {
  return <summary {...props}>{children}</summary>;
};

const DropdownList = ({ children, ...props }) => {
  return <ul {...props}>{children}</ul>;
};

const DropdownItem = ({ children, ...props }) => {
  return <li {...props}>{children}</li>;
};

const DropdownContainer = ({ children, position = 'left', ...props }) => {
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

DropdownTrigger.displayName = 'DropdownTrigger';

DropdownTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['left', 'right', 'center', 'top']),
};

export { DropdownContainer, DropdownTrigger, DropdownList, DropdownItem };
