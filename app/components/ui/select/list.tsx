// import dependencies
import classNames from 'classnames';
import { Input } from '@lunalytics/ui';

interface SelectListProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  isOpen: boolean;
  selectSearch: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const List = ({
  fullWidth,
  isOpen,
  selectSearch,
  handleSearch,
  children,
  ...props
}: SelectListProps) => {
  const classes = classNames('select-body', {
    'select-list-full-width': fullWidth,
    'select-body-open': isOpen,
  });

  return (
    <div className={classes} {...props}>
      <div style={{ padding: '4px 8px' }}>
        <Input onChange={handleSearch} value={selectSearch} />
      </div>
      {children}
    </div>
  );
};

List.displayName = 'Select.List';

export default List;
