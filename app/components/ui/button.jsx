import './button.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

// import local files
import { colorPropType } from '../../utils/propTypes';

const Button = ({
  children,
  iconLeft,
  iconRight,
  color,
  fullWidth,
  as: Wrapper = 'div',
  ...props
}) => {
  const classes = classNames('button', {
    [`button--${color}`]: color,
    'button-fixed-width': !fullWidth,
  });

  return (
    <Wrapper className={classes} {...props}>
      {iconLeft}
      {children && <div className="button-content">{children}</div>}
      {iconRight}
    </Wrapper>
  );
};

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  color: colorPropType,
  fullWidth: PropTypes.bool,
  as: PropTypes.elementType,
};

export default Button;
