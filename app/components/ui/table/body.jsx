import PropTypes from 'prop-types';

const Body = ({ children, ...props }) => {
  return <tbody {...props}>{children}</tbody>;
};

Body.propTypes = {
  children: PropTypes.node,
};

Body.displayName = 'TableBody';

export default Body;
