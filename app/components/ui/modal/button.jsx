import './style.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { colorPropType } from '../../../../shared/utils/propTypes';

const Button = ({ children, color, ...props }) => {
  const classes = classNames('modal-button', {
    [`modal-button--${color}`]: color,
  });

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Button.displayName = 'Modal.Button';

Button.propTypes = {
  children: PropTypes.node,
  color: colorPropType,
};

export default Button;
