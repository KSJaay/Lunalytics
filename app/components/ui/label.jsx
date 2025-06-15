import './label.scss';

// import node_modules
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import local files
import { colorPropType } from '../../../shared/utils/propTypes';

const Label = ({
  children,
  color = 'primary',
  style = 'solid',
  size = 'sm',
}) => {
  const classes = classNames('label', {
    [`label--${color}`]: color,
    [`label--${style}`]: style,
    [`label--size-${size}`]: size,
  });

  return <div className={classes}>{children}</div>;
};

Label.displayName = 'Label';

Label.propTypes = {
  children: PropTypes.node,
  color: colorPropType,
  style: PropTypes.oneOf(['solid', 'border', 'light', 'flat', 'shadow']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
};

export default Label;
