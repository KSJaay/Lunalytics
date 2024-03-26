import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

const Actions = ({ children, ...props }) => {
  return (
    <div className="modal-actions" {...props}>
      {children}
    </div>
  );
};

Actions.displayName = 'Modal.Actions';

Actions.propTypes = {
  children: PropTypes.node,
};

export default Actions;
