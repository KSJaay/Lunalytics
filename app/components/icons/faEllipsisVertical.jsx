// import dependencies
import PropTypes from 'prop-types';

const FaEllipsisVertical = ({ width = 25, height = 25 }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 128 512"
      height={`${height}px`}
      width={`${width}px`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"></path>
    </svg>
  );
};

FaEllipsisVertical.displayName = 'FaEllipsisVertical';

FaEllipsisVertical.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FaEllipsisVertical;
