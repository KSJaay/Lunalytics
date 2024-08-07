// import dependencies
import PropTypes from 'prop-types';

const FiLayout = ({ height = 20, width = 20 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);

FiLayout.displayName = 'FiLayout';

FiLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FiLayout;
