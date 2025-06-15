import PropTypes from 'prop-types';

const Caption = ({ children, ...props }) => {
  return <caption {...props}>{children}</caption>;
};

Caption.propTypes = {
  children: PropTypes.node,
};

Caption.displayName = 'TableCaption';

export default Caption;
