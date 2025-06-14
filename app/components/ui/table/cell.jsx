import classNames from 'classnames';
import PropTypes from 'prop-types';

const Cell = ({ children, align = 'left', className = '', ...props }) => {
  const classes = classNames(className, {
    [`table-align-${align}`]: true,
  });

  return (
    <td {...props} className={classes}>
      {children}
    </td>
  );
};

Cell.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Cell.displayName = 'TableCell';

export default Cell;
