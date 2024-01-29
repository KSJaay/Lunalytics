// import dependencies
import PropTypes from 'prop-types';

const Spacer = ({ size = 0 }) => (
  <div style={{ height: `${size}px`, color: '#ffffff00', userSelect: 'none' }}>
    Hidden text
  </div>
);

Spacer.propTypes = {
  size: PropTypes.number,
};

export default Spacer;
