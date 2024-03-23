import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

const Message = ({ children, ...props }) => {
  return (
    <div className="modal-message" {...props}>
      {children}
    </div>
  );
};

Message.displayName = 'Modal.Message';

Message.propTypes = {
  children: PropTypes.node,
};

export default Message;
