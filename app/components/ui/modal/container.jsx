import './style.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Container = ({ children, glassmorph, ...props }) => {
  const classes = classNames('modal-alert-container', {
    'modal-alert-container--glassmorph': glassmorph,
    'modal-alert-container--no-glassmorph': !glassmorph,
  });

  return (
    <div className={classes} {...props}>
      <div className="modal-alert-content">{children}</div>
    </div>
  );
};

Container.displayName = 'Modal.Container';

Container.propTypes = {
  children: PropTypes.node,
  glassmorph: PropTypes.bool,
};

export default Container;
