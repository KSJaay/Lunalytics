// import dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Trigger = ({ asInput, children, ...props }) => {
  const classes = classNames({
    'dropdown-trigger-input': asInput,
  });

  return (
    <summary className={classes} {...props}>
      {children}
    </summary>
  );
};

Trigger.displayName = 'DropdownTrigger';

Trigger.propTypes = {
  asInput: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Trigger;
