// import dependencies
import classNames from 'classnames';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  dotColor?: 'red' | 'green' | 'blue';
  showDot?: boolean;
  isSelected?: boolean;
  as?: React.ElementType;
}

const Item = ({
  dotColor,
  showDot = false,
  isSelected = false,
  children,
  as: Wrapper = 'div',
  ...props
}: SelectItemProps) => {
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
