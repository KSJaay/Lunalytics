import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

const Message = ({ children, ...props }) => {
  return (
    <div className="modal-alert-message" {...props}>
      {children}
    </div>
  );
};

Message.displayName = 'Modal.Message';

Message.propTypes = {
  children: PropTypes.node,
};

export default Message;
