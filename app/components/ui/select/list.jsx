// import dependencies
import PropTypes from 'prop-types';
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

List.propTypes = {
  fullWidth: PropTypes.bool,
  isOpen: PropTypes.bool,
  selectSearch: PropTypes.string,
  handleSearch: PropTypes.func,
  children: PropTypes.node,
};

export default List;
