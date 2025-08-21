// import dependencies
import classNames from 'classnames';

const List = ({ fullWidth, isOpen, children, ...props }) => {
  const classes = classNames('dropdown-body', {
    'dropdown-list-full-width': fullWidth,
    'dropdown-body-open': isOpen,
  });

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

List.displayName = 'Dropdown.List';

export default List;
