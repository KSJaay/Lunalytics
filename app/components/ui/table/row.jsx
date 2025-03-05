import PropTypes from 'prop-types';

const Row = ({ children, ...props }) => {
  return <tr {...props}>{children}</tr>;
};

Row.propTypes = {
  children: PropTypes.node,
};

Row.displayName = 'TableRow';

export default Row;
