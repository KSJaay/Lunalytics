// import dependencies
import classNames from 'classnames';
import TextInput from '../input';

const List = ({
  fullWidth,
  isOpen,
  selectSearch,
  handleSearch,
  children,
  ...props
}) => {
  const classes = classNames('select-body', {
    'select-list-full-width': fullWidth,
    'select-body-open': isOpen,
  });

  return (
    <div className={classes} {...props}>
      <div style={{ padding: '4px 8px' }}>
        <TextInput onChange={handleSearch} value={selectSearch} />
      </div>
      {children}
    </div>
  );
};

List.displayName = 'Select.List';

export default List;
