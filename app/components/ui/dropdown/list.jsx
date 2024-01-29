// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

const List = ({ fullWidth, children, ...props }) => {
  const classes = classNames('dropdown-list', {
    'dropdown-list-full-width': fullWidth,
  });

  return (
    <ul className={classes} {...props}>
      {children}
    </ul>
  );
};

List.displayName = 'Dropdown.List';

List.propTypes = {
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
};

export default List;
