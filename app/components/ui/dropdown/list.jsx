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

export default List;
