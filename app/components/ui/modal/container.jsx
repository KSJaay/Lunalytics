import './style.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

// import local files
import { IoMdClose } from '../../icons';

const Container = ({ children, glassmorph, closeButton, ...props }) => {
  const classes = classNames('modal-container', {
    'modal-container--glassmorph': glassmorph,
    'modal-container--no-glassmorph': !glassmorph,
  });

  return (
    <div className={classes} {...props}>
      <div className="modal-content">
        {closeButton && (
          <div className="modal-close-button" onClick={closeButton}>
            <IoMdClose style={{ width: '18px', height: '18px' }} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

Container.displayName = 'Modal.Container';

Container.propTypes = {
  children: PropTypes.node,
  glassmorph: PropTypes.bool,
  closeButton: PropTypes.func,
};

export default Container;
