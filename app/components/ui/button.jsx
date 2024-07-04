import './button.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

// import local files
import { colorPropType } from '../../../shared/utils/propTypes';

const Button = ({
  children,
  iconLeft,
  iconRight,
  color,
  outline,
  fullWidth,
  tabIndex = 0,
  as: Wrapper = 'div',
  ...props
}) => {
  const classes = classNames('button', {
    [`button--${color}`]: !outline && color,
    [`button--${outline}-outline`]: !color && outline,
    'button-fixed-width': !fullWidth,
  });

  return (
    <Wrapper className={classes} tabIndex={tabIndex} {...props}>
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
  outline: colorPropType,
  fullWidth: PropTypes.bool,
  tabIndex: PropTypes.number,
  as: PropTypes.elementType,
};

export default Button;
