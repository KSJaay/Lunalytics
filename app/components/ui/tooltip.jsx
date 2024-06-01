import './tooltip.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tooltip = ({ text = '', position = 'top', children }) => {
  const classes = classNames('tooltip', `tooltip--${position}`, {});

  return (
    <div className="tooltip-container">
      <div className={classes}>{text}</div>
      {children}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  text: PropTypes.string,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  children: PropTypes.node,
};

export default Tooltip;
