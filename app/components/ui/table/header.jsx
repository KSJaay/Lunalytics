import PropTypes from 'prop-types';

const Header = ({ children }) => {
  return <thead>{children}</thead>;
};

Header.propTypes = {
  children: PropTypes.node,
};

Header.displayName = 'TableHeader';

export default Header;
