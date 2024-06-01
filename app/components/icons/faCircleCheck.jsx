// import dependencies
import PropTypes from 'prop-types';

const FaCircleCheck = ({ height, width, checkColor = 'white' }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241"></path>
    <path
      fill={checkColor}
      d="M256 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
    ></path>
  </svg>
);

FaCircleCheck.displayName = 'FaCircleCheck';

FaCircleCheck.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  checkColor: PropTypes.string,
};

export default FaCircleCheck;
