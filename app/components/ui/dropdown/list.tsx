// import dependencies
import classNames from 'classnames';

interface DropdownListProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  isOpen: boolean;
  children: React.ReactNode;
}

const List = ({ fullWidth, isOpen, children, ...props }: DropdownListProps) => {
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
