import PropTypes from 'prop-types';

const Footer = ({ children, ...props }) => {
  return <tfoot {...props}>{children}</tfoot>;
};

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.displayName = 'TableFooter';

export default Footer;
