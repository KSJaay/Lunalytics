import classNames from 'classnames';
import './style.scss';

const Title = ({ children, ...props }) => {
  return (
    <div className="modal-alert-title" {...props}>
      {children}
    </div>
  );
};

const Message = ({ children, ...props }) => {
  return (
    <div className="modal-alert-message" {...props}>
      {children}
    </div>
  );
};

const Actions = ({ children, ...props }) => {
  return (
    <div className="modal-alert-actions" {...props}>
      {children}
    </div>
  );
};

const Button = ({ children, color, ...props }) => {
  const classes = classNames('modal-alert-button', {
    [`modal-alert-button--${color}`]: color,
  });

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

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

const AlertBox = {
  Actions,
  Button,
  Container,
  Message,
  Title,
};

export default AlertBox;
