// import dependencies
import PropTypes from 'prop-types';

const FaClose = ({ width = 25, height = 25 }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
  </svg>
);

FaClose.displayName = 'FaClose';

FaClose.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FaClose;
