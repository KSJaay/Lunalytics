import PropTypes from 'prop-types';

const Footer = ({ children }) => {
  return <tfoot>{children}</tfoot>;
};

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.displayName = 'TableFooter';

export default Footer;
