import PropTypes from 'prop-types';

const Header = ({ children, ...props }) => {
  return <thead {...props}>{children}</thead>;
};

Header.propTypes = {
  children: PropTypes.node,
};

Header.displayName = 'TableHeader';

export default Header;
