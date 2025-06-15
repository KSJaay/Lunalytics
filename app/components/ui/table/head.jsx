import classNames from 'classnames';
import PropTypes from 'prop-types';

const Head = ({ children, align = 'left', className, ...props }) => {
  const classes = classNames(className, {
    [`table-align-${align}`]: true,
  });

  return (
    <th {...props} className={classes}>
      {children}
    </th>
  );
};

Head.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Head.displayName = 'TableHead';

export default Head;
