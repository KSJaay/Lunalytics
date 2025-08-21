// import dependencies
import classNames from 'classnames';

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

export default Item;
