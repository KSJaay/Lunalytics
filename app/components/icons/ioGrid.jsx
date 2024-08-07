// import dependencies
import PropTypes from 'prop-types';

const IoGrid = ({ height, width }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height={`${height}px`}
    width={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M204 240H68a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36zm240 0H308a36 36 0 0 1-36-36V68a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36zM204 480H68a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36zm240 0H308a36 36 0 0 1-36-36V308a36 36 0 0 1 36-36h136a36 36 0 0 1 36 36v136a36 36 0 0 1-36 36z"></path>
  </svg>
);

IoGrid.displayName = 'IoGrid';

IoGrid.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default IoGrid;
