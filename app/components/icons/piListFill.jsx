// import dependencies
import PropTypes from 'prop-types';

const PiListFill = ({ width, height }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 256 256"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M224,120v16a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a8,8,0,0,1,8-8H216A8,8,0,0,1,224,120Zm-8,56H40a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V184A8,8,0,0,0,216,176Zm0-128H40a8,8,0,0,0-8,8V72a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V56A8,8,0,0,0,216,48Z"></path>
  </svg>
);

PiListFill.displayName = 'PiListFill';

PiListFill.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default PiListFill;
