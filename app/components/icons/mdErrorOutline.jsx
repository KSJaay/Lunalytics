// import dependencies
import PropTypes from 'prop-types';

const MdErrorOutline = ({ width = 25, height = 25 }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 24 24"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="none" d="M0 0h24v24H0V0z"></path>
    <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
  </svg>
);

MdErrorOutline.displayName = 'MdErrorOutline';

MdErrorOutline.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default MdErrorOutline;
