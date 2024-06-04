// import dependencies
import PropTypes from 'prop-types';

const IoArrowBack = ({ height = 25, width = 25 }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="48"
      d="M244 400 100 256l144-144M120 256h292"
    ></path>
  </svg>
);

IoArrowBack.displayName = 'IoArrowBack';

IoArrowBack.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default IoArrowBack;
