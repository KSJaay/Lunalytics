import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

const Title = ({ children, ...props }) => {
  return (
    <div className="modal-title" {...props}>
      {children}
    </div>
  );
};

Title.displayName = 'Modal.Title';

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
