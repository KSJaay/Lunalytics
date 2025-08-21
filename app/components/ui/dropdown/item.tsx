// import dependencies
import classNames from 'classnames';

const Item = ({
  dotColor,
  showDot = false,
  isSelected = false,
  children,
  className,
  as: Wrapper = 'div',
  ...props
}) => {
  const classes = classNames('dropdown-item-dot', className, {
    'dropdown-item-selected': isSelected,
    [`dropdown-item-dot--${dotColor}`]: dotColor,
  });

  return (
    <Wrapper className="dropdown-item" {...props}>
      {showDot && <span className={classes}>• </span>}
      {children}
    </Wrapper>
  );
};

Item.displayName = 'Dropdown.Item';

export default Item;
