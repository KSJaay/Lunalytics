// import dependencies
import PropTypes from 'prop-types';

const Item = ({ children, ...props }) => {
  return <li {...props}>{children}</li>;
};

Item.displayName = 'Dropdown.Item';

Item.propTypes = {
  children: PropTypes.node,
};

export default Item;
