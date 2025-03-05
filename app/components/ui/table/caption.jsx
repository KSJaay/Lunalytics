import PropTypes from 'prop-types';

const Caption = ({ children }) => {
  return <caption>{children}</caption>;
};

Caption.propTypes = {
  children: PropTypes.node,
};

Caption.displayName = 'TableCaption';

export default Caption;
