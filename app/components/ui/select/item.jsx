// import dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import local files
import { colorPropType } from '../../../utils/propTypes';

const Item = ({
  dotColor,
  showDot = false,
  isSelected = false,
  children,
  as: Wrapper = 'div',
  ...props
}) => {
  const classes = classNames('select-item-dot', {
    'select-item-selected': isSelected,
    [`select-item-dot--${dotColor}`]: dotColor,
  });

  return (
    <Wrapper className="select-item" {...props}>
      {showDot && <span className={classes}>• </span>}
      {children}
    </Wrapper>
  );
};

Item.displayName = 'Select.Item';

Item.propTypes = {
  dotColor: colorPropType,
  showDot: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  as: PropTypes.elementType,
};

export default Item;
