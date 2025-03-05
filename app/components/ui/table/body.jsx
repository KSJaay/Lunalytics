import PropTypes from 'prop-types';

const Body = ({ children }) => {
  return <tbody>{children}</tbody>;
};

Body.propTypes = {
  children: PropTypes.node,
};

Body.displayName = 'TableBody';

export default Body;
